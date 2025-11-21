import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) { }

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepository.create(createDriverDto);
    return this.driverRepository.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({ relations: ['deliveries', 'deliveries.order'] });
  }

  async findById(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['deliveries', 'deliveries.order'],
    });
    if (!driver) {
      throw new NotFoundException(`Conductor ${id} no encontrado`);
    }
    return driver;
  }

  async remove(id: number): Promise<{ message: string }> {
    const driver = await this.findById(id);
    await this.driverRepository.remove(driver);
    return { message: 'Conductor eliminado correctamente' };
  }
}