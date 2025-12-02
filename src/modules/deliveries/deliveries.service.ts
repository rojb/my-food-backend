import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery, DeliveryStatus } from './entities/delivery.entity';
import { DeliveryGroupedByStatusDto } from './dto/delivery-group-by-status.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) { }

  create(createDeliveryDto: CreateDeliveryDto) {
    return 'This action adds a new delivery';
  }

  findAll() {
    return `This action returns all deliveries`;
  }

  async findByDriver(driverId: number): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      where: { driverId },
      relations: ['order', 'order.customer', 'order.address', 'driver'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByDriverGrouped(driverId: number): Promise<DeliveryGroupedByStatusDto> {
    const deliveries = await this.findByDriver(driverId);

    const grouped: DeliveryGroupedByStatusDto = {
      pending: [],
      accepted: [],
      active: [],
      completed: [],
      cancelled: []
    };

    deliveries.forEach(delivery => {
      const deliveryData = {
        id: delivery.id,
        orderId: delivery.orderId,
        status: delivery.status,
        createdAt: delivery.createdAt,
        acceptedAt: delivery.acceptedAt,
        completedAt: delivery.completedAt,
        order: {
          id: delivery.order.id,
          total: delivery.order.total,
          deliveryPrice: delivery.order.deliveryPrice,
          date: delivery.order.date,
          customer: {
            id: delivery.order.customer.id,
            name: delivery.order.customer.name,
            lastName: delivery.order.customer.lastName,
          },
          address: {
            id: delivery.order.address.id,
            name: delivery.order.address.name,
            description: delivery.order.address.description,
            coordinateX: delivery.order.address.coordinateX,
            coordinateY: delivery.order.address.coordinateY,
          }
        }
      };

      switch (delivery.status) {
        case DeliveryStatus.PENDING:
          grouped.pending.push(deliveryData);
          break;
        case DeliveryStatus.ACCEPTED:
          grouped.accepted.push(deliveryData);
          break;
        case DeliveryStatus.ACTIVE:
          grouped.active.push(deliveryData);
          break;
        case DeliveryStatus.COMPLETED:
          grouped.completed.push(deliveryData);
          break;
        case DeliveryStatus.CANCELLED:
          grouped.cancelled.push(deliveryData);
          break;
      }
    });

    return grouped;
  }

  async updateStatus(id: number, status: DeliveryStatus): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({ where: { id } });

    if (!delivery) {
      throw new NotFoundException(`Entrega ${id} no encontrada`);
    }

    // Actualizar timestamps según el estado
    const updateData: any = { status };

    if (status === DeliveryStatus.ACCEPTED && !delivery.acceptedAt) {
      updateData.acceptedAt = new Date();
    }

    if (status === DeliveryStatus.COMPLETED && !delivery.completedAt) {
      updateData.completedAt = new Date();
    }

    await this.deliveryRepository.update(id, updateData);

    let ani = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'order.address', 'driver'],
    });

    if (!ani) {
      throw new NotFoundException('Entrga no encontrada')
    }
    return ani;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
