import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { CustomerAddress } from './entities/customer-address';

@Module({
  imports: [TypeOrmModule.forFeature([Address,CustomerAddress])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule { }
