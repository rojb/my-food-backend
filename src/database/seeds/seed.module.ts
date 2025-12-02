import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
/* 
import { CategorySeeder } from './category.seeder';
import { AddressSeeder } from './address.seeder';
import { CustomerSeeder } from './customer.seeder';
import { ProductSeeder } from './product.seeder'; 
*/
import { OrderStatusSeeder } from './order-status.seeder';
import { DriverSeeder } from './driver.seeder';
import { OrderStatus } from 'src/modules/orders/entities/order-status.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderStatus,
            Category,
            Address,
            Customer,
            Driver,
            Product,
        ]),
    ],
    providers: [
        SeedService,
        OrderStatusSeeder,
        /*
       CategorySeeder,
       AddressSeeder,
       CustomerSeeder, */
        DriverSeeder,
        /*         ProductSeeder, */
    ],
    exports: [SeedService],
})
export class SeedModule { }