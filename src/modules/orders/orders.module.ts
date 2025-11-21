import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-products.entity';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddress } from '../addresses/entities/customer-address';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, OrderProduct,CustomerAddress])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
