import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { redisClient } from 'src/common/providers/redis.provider';
import { Delivery, DeliveryStatus } from './entities/delivery.entity';
import { Order } from '../orders/entities/order.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { DeliveriesByStatusDto, DeliveryDetailDto } from './dto/update-delivery.dto';

interface PendingDeliveryAssignment {
  orderId: number;
  addressX: number;
  addressY: number;
  customerId: number;
  total: number;
  driversToNotify: number[];
  notifiedDrivers: number[];
  currentDriverIndex: number;
  maxRadius: number;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) { }

  async findNearestDriversForDelivery(
    orderAddressX: number,
    orderAddressY: number,
    maxRadius: number = 5000,
  ): Promise<Driver[]> {
    const sql = `
      SELECT d.id, d.name, d.last_name, d.is_available,
        ST_Distance(
          dl.location::geography,
          ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
        ) AS distance_m
      FROM drivers d
      INNER JOIN driver_locations dl ON dl.driver_id = d.id
      WHERE d.is_available = true
        AND ST_Distance(
          dl.location::geography,
          ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
        ) <= $3
      ORDER BY distance_m ASC
      LIMIT 10;
    `;

    try {
      const result = await this.driverRepository.query(sql, [
        orderAddressY,
        orderAddressX,
        maxRadius,
      ]);
      return result;
    } catch (error) {
      console.error('Error finding nearby drivers:', error);
      return [];
    }
  }

  async initiateDeliveryAssignment(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['address'],
    });

    if (!order) {
      throw new NotFoundException(`Orden ${orderId} no encontrada`);
    }

    // Buscar conductores cercanos
    const nearestDrivers = await this.findNearestDriversForDelivery(
      order.address.coordinateX,
      order.address.coordinateY,
    );

    if (nearestDrivers.length === 0) {
      throw new BadRequestException(
        'No hay conductores disponibles en tu zona',
      );
    }

    // Crear estructura de asignación pendiente en Redis
    const assignmentData: PendingDeliveryAssignment = {
      orderId,
      addressX: order.address.coordinateX,
      addressY: order.address.coordinateY,
      customerId: order.customerId,
      total: order.total,
      driversToNotify: nearestDrivers.map((d) => d.id),
      notifiedDrivers: [],
      currentDriverIndex: 0,
      maxRadius: 5000,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
    };

    const redisKey = `delivery:assignment:${orderId}`;
    await redisClient.setex(
      redisKey,
      600, // 10 minutos
      JSON.stringify(assignmentData),
    );

    // Notificar al primer conductor
    await this.notifyNextDriver(orderId);
  }

  async notifyNextDriver(orderId: number): Promise<void> {
    const redisKey = `delivery:assignment:${orderId}`;
    const assignmentJson = await redisClient.get(redisKey);

    if (!assignmentJson) {
      throw new NotFoundException(`Asignación para orden ${orderId} no encontrada`);
    }

    const assignment: PendingDeliveryAssignment = JSON.parse(assignmentJson);

    // Verificar si ya se notificó a todos los conductores
    if (assignment.currentDriverIndex >= assignment.driversToNotify.length) {
      throw new BadRequestException(
        'No hay más conductores disponibles para esta entrega',
      );
    }

    const driverId = assignment.driversToNotify[assignment.currentDriverIndex];
    assignment.notifiedDrivers.push(driverId);

    // Guardar estado actualizado
    await redisClient.setex(
      redisKey,
      600,
      JSON.stringify(assignment),
    );

    // Guardar en Redis la notificación pendiente
    const notificationKey = `driver:${driverId}:pending_delivery:${orderId}`;
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['customer', 'address'],
    });
    if (!order) {
      throw new NotFoundException('Order no encontrada')
    }
    const notification = {
      orderId,
      driverId,
      customerName: order.customer.name,
      total: order.total,
      addressName: order.address.name,
      addressDescription: order.address.description,
      coordinateX: order.address.coordinateX,
      coordinateY: order.address.coordinateY,
      notifiedAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutos para decidir
    };

    await redisClient.setex(
      notificationKey,
      120, // 2 minutos
      JSON.stringify(notification),
    );

    console.log(`📢 Notificando al conductor ${driverId} sobre la orden ${orderId}`);

    // Aquí emitir a través de WebSocket si tienes conexión del conductor
    // this.deliveryGateway.notifyDriver(driverId, notification);
  }

  async handleDeliveryResponse(
    orderId: number,
    driverId: number,
    response: 'accept' | 'reject',
  ): Promise<Delivery | { message: string }> {
    const redisKey = `delivery:assignment:${orderId}`;
    const assignmentJson = await redisClient.get(redisKey);

    if (!assignmentJson) {
      throw new NotFoundException(`Asignación para orden ${orderId} no encontrada`);
    }

    const assignment: PendingDeliveryAssignment = JSON.parse(assignmentJson);

    // Verificar que el conductor notificado sea el que responde
    const currentDriverId =
      assignment.driversToNotify[assignment.currentDriverIndex];
    if (driverId !== currentDriverId) {
      throw new BadRequestException(
        'Este conductor no fue notificado para esta entrega',
      );
    }

    // Limpiar notificación
    const notificationKey = `driver:${driverId}:pending_delivery:${orderId}`;
    await redisClient.del(notificationKey);

    if (response === 'accept') {
      // Crear entrega y asignarlo al conductor
      const delivery = this.deliveryRepository.create({
        orderId,
        driverId,
        status: DeliveryStatus.ACCEPTED,
      });

      await this.deliveryRepository.save(delivery);

      // Limpiar Redis
      await redisClient.del(redisKey);

      // Rechazar a todos los otros conductores
      for (let i = assignment.currentDriverIndex + 1; i < assignment.notifiedDrivers.length; i++) {
        const otherDriverId = assignment.notifiedDrivers[i];
        await redisClient.del(
          `driver:${otherDriverId}:pending_delivery:${orderId}`,
        );
      }

      console.log(
        `✅ Conductor ${driverId} aceptó la entrega ${orderId}`,
      );

      return delivery;
    } else {
      // Rechazó, notificar al siguiente conductor
      assignment.currentDriverIndex++;

      if (assignment.currentDriverIndex < assignment.driversToNotify.length) {
        await redisClient.setex(
          redisKey,
          600,
          JSON.stringify(assignment),
        );
        await this.notifyNextDriver(orderId);

        return {
          message: `Conductor rechazó. Notificando al siguiente conductor...`,
        };
      } else {
        // No hay más conductores
        await redisClient.del(redisKey);

        throw new BadRequestException(
          'No hay más conductores disponibles para esta entrega',
        );
      }
    }
  }

  async getPendingNotification(
    driverId: number,
    orderId: number,
  ): Promise<any> {
    const notificationKey = `driver:${driverId}:pending_delivery:${orderId}`;
    const notification = await redisClient.get(notificationKey);

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada o expirada');
    }

    return JSON.parse(notification);
  }

  async getPendingDeliveries(driverId: number): Promise<any[]> {
    // Obtener todas las notificaciones pendientes del conductor
    const pattern = `driver:${driverId}:pending_delivery:*`;
    const keys = await redisClient.keys(pattern);

    const notifications: any = [];
    for (const key of keys) {
      const notification = await redisClient.get(key);
      if (notification) {
        notifications.push(JSON.parse(notification));
      }
    }

    return notifications;
  }

  async updateStatus(id: number, status: DeliveryStatus): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({ where: { id } });

    if (!delivery) {
      throw new NotFoundException(`Entrega ${id} no encontrada`);
    }

    const updateData: any = { status };

    if (status === DeliveryStatus.ACCEPTED && !delivery.acceptedAt) {
      updateData.acceptedAt = new Date();
    }

    if (status === DeliveryStatus.COMPLETED && !delivery.completedAt) {
      updateData.completedAt = new Date();
    }

    await this.deliveryRepository.update(id, updateData);

    const ani = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'order.address', 'driver'],
    });

    if (!ani) {
      throw new NotFoundException('Order no encontrada')
    }
    return ani;
  }

  // Métodos anteriores...
  async findByDriver(driverId: number): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      where: { driverId },
      relations: ['order', 'order.customer', 'order.address', 'driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      relations: ['order', 'driver'],
    });
  }

  async findOne(id: number): Promise<Delivery> {
    const del = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['order', 'driver'],
    });
    if (!del) {
      throw new NotFoundException('Orden no encontrada')
    }
    return del;
  }

  async remove(id: number): Promise<{ message: string }> {
    const delivery = await this.deliveryRepository.findOne({ where: { id } });
    if (!delivery) {
      throw new NotFoundException(`Entrega ${id} no encontrada`);
    }
    await this.deliveryRepository.remove(delivery);
    return { message: 'Entrega eliminada correctamente' };
  }

  async getDeliveriesByStatus(driverId: number): Promise<DeliveriesByStatusDto> {
    const deliveries = await this.deliveryRepository.find({
      where: { driverId },
      relations: [
        'order',
        'order.customer',
        'order.address',
        'order.orderProducts',
        'order.orderProducts.product',
      ],
      order: { createdAt: 'DESC' },
    });

    // Agrupar por estado
    const grouped: DeliveriesByStatusDto = {
      pending: [],
      accepted: [],
      active: [],
      completed: [],
      cancelled: [],
    };

    deliveries.forEach((delivery) => {
      const deliveryDto: DeliveryDetailDto = {
        id: delivery.id,
        orderId: delivery.orderId,
        status: delivery.status,
        createdAt: delivery.createdAt,
        acceptedAt: delivery.acceptedAt,
        completedAt: delivery.completedAt,
        order: {
          id: delivery.order.id,
          total: Number(delivery.order.total),
          deliveryPrice: Number(delivery.order.deliveryPrice),
          date: delivery.order.date,
          customer: {
            id: delivery.order.customer.id,
            name: delivery.order.customer.name,
            lastName: delivery.order.customer.lastName,
            telegramId: delivery.order.customer.telegramId,
          },
          address: {
            id: delivery.order.address.id,
            name: delivery.order.address.name,
            description: delivery.order.address.description,
            coordinateX: Number(delivery.order.address.coordinateX),
            coordinateY: Number(delivery.order.address.coordinateY),
          },
          orderProducts: delivery.order.orderProducts.map((op) => ({
            id: op.id,
            quantity: op.quantity,
            product: {
              id: op.product.id,
              name: op.product.name,
              price: Number(op.product.price),
              currency: op.product.currency,
            },
          })),
        },
      };

      switch (delivery.status) {
        case DeliveryStatus.PENDING:
          grouped.pending.push(deliveryDto);
          break;
        case DeliveryStatus.ACCEPTED:
          grouped.accepted.push(deliveryDto);
          break;
        case DeliveryStatus.ACTIVE:
          grouped.active.push(deliveryDto);
          break;
        case DeliveryStatus.COMPLETED:
          grouped.completed.push(deliveryDto);
          break;
        case DeliveryStatus.CANCELLED:
          grouped.cancelled.push(deliveryDto);
          break;
      }
    });

    return grouped;
  }

  async getDeliveriesBySpecificStatus(
    driverId: number,
    status: DeliveryStatus,
  ): Promise<DeliveryDetailDto[]> {
    const deliveries = await this.deliveryRepository.find({
      where: { driverId, status },
      relations: [
        'order',
        'order.customer',
        'order.address',
        'order.orderProducts',
        'order.orderProducts.product',
      ],
      order: { createdAt: 'DESC' },
    });

    return deliveries.map((delivery) => ({
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      createdAt: delivery.createdAt,
      acceptedAt: delivery.acceptedAt,
      completedAt: delivery.completedAt,
      order: {
        id: delivery.order.id,
        total: Number(delivery.order.total),
        deliveryPrice: Number(delivery.order.deliveryPrice),
        date: delivery.order.date,
        customer: {
          id: delivery.order.customer.id,
          name: delivery.order.customer.name,
          lastName: delivery.order.customer.lastName,
          telegramId: delivery.order.customer.telegramId,
        },
        address: {
          id: delivery.order.address.id,
          name: delivery.order.address.name,
          description: delivery.order.address.description,
          coordinateX: Number(delivery.order.address.coordinateX),
          coordinateY: Number(delivery.order.address.coordinateY),
        },
        orderProducts: delivery.order.orderProducts.map((op) => ({
          id: op.id,
          quantity: op.quantity,
          product: {
            id: op.product.id,
            name: op.product.name,
            price: Number(op.product.price),
            currency: op.product.currency,
          },
        })),
      },
    }));
  }

  async getActiveDelivery(driverId: number): Promise<DeliveryDetailDto | null> {
    const delivery = await this.deliveryRepository.findOne({
      where: { driverId, status: DeliveryStatus.ACTIVE },
      relations: [
        'order',
        'order.customer',
        'order.address',
        'order.orderProducts',
        'order.orderProducts.product',
      ],
    });

    if (!delivery) {
      return null;
    }

    return {
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      createdAt: delivery.createdAt,
      acceptedAt: delivery.acceptedAt,
      completedAt: delivery.completedAt,
      order: {
        id: delivery.order.id,
        total: Number(delivery.order.total),
        deliveryPrice: Number(delivery.order.deliveryPrice),
        date: delivery.order.date,
        customer: {
          id: delivery.order.customer.id,
          name: delivery.order.customer.name,
          lastName: delivery.order.customer.lastName,
          telegramId: delivery.order.customer.telegramId,
        },
        address: {
          id: delivery.order.address.id,
          name: delivery.order.address.name,
          description: delivery.order.address.description,
          coordinateX: Number(delivery.order.address.coordinateX),
          coordinateY: Number(delivery.order.address.coordinateY),
        },
        orderProducts: delivery.order.orderProducts.map((op) => ({
          id: op.id,
          quantity: op.quantity,
          product: {
            id: op.product.id,
            name: op.product.name,
            price: Number(op.product.price),
            currency: op.product.currency,
          },
        })),
      },
    };
  }

}