import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { DriverLocation } from './entities/driver-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, DriverLocation])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule { }
