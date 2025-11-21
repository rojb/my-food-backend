import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['restaurant'] });
  }

  async findById(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    if (!address) {
      throw new NotFoundException(`Dirección ${id} no encontrada`);
    }
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    await this.findById(id);
    await this.addressRepository.update(id, updateAddressDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const address = await this.findById(id);
    await this.addressRepository.remove(address);
    return { message: 'Dirección eliminada correctamente' };
  }
}