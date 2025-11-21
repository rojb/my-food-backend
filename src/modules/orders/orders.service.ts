import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-products.entity';
import { Product } from '../products/entities/product.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createOrderDto: CreateOrderDto, customerId: number): Promise<Order> {
    let total = createOrderDto.deliveryPrice;

    const orderProducts: any[] = [];
    for (const product of createOrderDto.products) {
      const prod = await this.productRepository.findOne({
        where: { id: product.productId },
      });
      if (!prod) {
        throw new NotFoundException(`Producto ${product.productId} no encontrado`);
      }
      total += Number(prod.price) * product.quantity;
      orderProducts.push({ productId: product.productId, quantity: product.quantity });
    }

    const order = this.orderRepository.create({
      customerId,
      customerAddressId: createOrderDto.customerAddressId,
      total,
      deliveryPrice: createOrderDto.deliveryPrice,
      orderStatusId: createOrderDto.orderStatusId || 1,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const op of orderProducts) {
      await this.orderProductRepository.save({
        orderId: savedOrder.id,
        ...op,
      });
    }

    return this.findById(savedOrder.id);
  }

  async findAll(customerId?: number): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.customerAddress', 'customerAddress');

    if (customerId) {
      query.where('order.customerId = :customerId', { customerId });
    }

    return query.orderBy('order.date', 'DESC').getMany();
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'orderProducts',
        'orderProducts.product',
        'orderStatus',
        'customerAddress',
        'deliveries',
        'deliveries.driver',
      ],
    });
    if (!order) {
      throw new NotFoundException(`Orden ${id} no encontrada`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findById(id);
    await this.orderRepository.update(id, updateOrderDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findById(id);
    await this.orderProductRepository.delete({ orderId: id });
    await this.orderRepository.remove(order);
    return { message: 'Orden eliminada correctamente' };
  }
}