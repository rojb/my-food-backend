import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramLoginDto } from './dto/telegram-login.dto';
import { Customer } from '../customers/entities/customer.entity';
import { DriverLoginDto } from './dto/driver-login.dto';
import { Driver } from '../drivers/entities/driver.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    private jwtService: JwtService,
  ) { }

  async telegramLogin(loginDto: TelegramLoginDto) {
    let customer = await this.customerRepository.findOne({
      where: { telegramId: loginDto.telegramId },
    });

    if (!customer) {
      customer = this.customerRepository.create({
        telegramId: loginDto.telegramId,
        name: loginDto.name,
        lastName: loginDto.lastName,
      });
      customer = await this.customerRepository.save(customer);
    }

    const payload = { sub: customer.id, telegramId: customer.telegramId };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      customer: {
        id: customer.id,
        name: customer.name,
        lastName: customer.lastName,
        telegramId: customer.telegramId,
      },
    };
  }

  async validateCustomer(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async driverLogin(loginDto: DriverLoginDto) {
    const driver = await this.driverRepository.findOne({
        where: { email: loginDto.email },
    });

    if (!driver) {
        throw new NotFoundException(`Conductor ${loginDto.email} no encontrado`);
    }

    // Aquí deberías validar la contraseña con bcrypt
    // Por ahora es una validación simple
    if (driver.password !== loginDto.password) {
        throw new BadRequestException('Contraseña incorrecta');
    }

    // Generar JWT (necesitas inyectar JwtService)
    const payload = { sub: driver.id, name: driver.name };
    const access_token = this.jwtService.sign(payload, {
        secret: process.env.DRIVER_JWT_SECRET || 'driver-secret-key',
        expiresIn: '24h',
    });

    return {
        access_token,
        driver: {
            id: driver.id,
            name: driver.name,
            lastName: driver.lastName,
            isAvailable: driver.isAvailable,
        },
    };
}
}