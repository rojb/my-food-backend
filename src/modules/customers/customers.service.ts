import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from '../addresses/entities/customer-address.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerAddress)
    private customerAddressRepository: Repository<CustomerAddress>,
  ) { }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: [
        'customerAddresses',
        'customerAddresses.address',
        'orders',
        'ratings',
        'favorites',
      ],
    });
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: [
        'customerAddresses',
        'customerAddresses.address',
        'orders',
        'ratings',
        'favorites',
        'favorites.product',
      ],
    });
    if (!customer) {
      throw new NotFoundException(`Cliente ${id} no encontrado`);
    }
    return customer;
  }

  async addAddress(customerId: number, addressId: number) {
    const customer = await this.findById(customerId);
    
    if (!customer) {
      throw new NotFoundException(`Cliente ${customerId} no encontrado`);
    }

    const customerAddress = this.customerAddressRepository.create({
      customerId,
      addressId,
    });

    return this.customerAddressRepository.save(customerAddress);
  }

  async getAddresses(customerId: number) {
    return this.customerAddressRepository.find({
      where: { customerId },
      relations: ['address'],
    });
  }

  async removeAddress(customerId: number, addressId: number) {
    await this.customerAddressRepository.delete({
      customerId,
      addressId,
    });
    return { message: 'Dirección removida del cliente' };
  }
}