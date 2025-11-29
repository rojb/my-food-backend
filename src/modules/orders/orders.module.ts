import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddress } from '../addresses/entities/customer-address.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';
import { OrderStatus } from './entities/order-status.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,
    OrderProduct,
    Delivery,
    CustomerAddress,
    OrderStatus, Product
  ])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
