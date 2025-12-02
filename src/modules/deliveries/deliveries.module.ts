import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { Driver } from '../drivers/entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Delivery])],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule { }
