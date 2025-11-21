import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramLoginDto } from './dto/telegram-login.dto';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
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
}