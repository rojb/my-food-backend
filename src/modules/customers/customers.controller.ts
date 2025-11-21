import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentCustomer } from 'src/common/decorators/current-customer.decorator';
import { Customer } from './entities/customer.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del cliente actual' })
  @ApiResponse({ status: 200, description: 'Perfil del cliente' })
  getProfile(@CurrentCustomer() customer: Customer) {
    return this.customersService.findById(customer.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Datos del cliente' })
  findById(@Param('id') id: number) {
    return this.customersService.findById(id);
  }

  @Get(':customerId/addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener direcciones del cliente' })
  @ApiResponse({ status: 200, description: 'Direcciones del cliente' })
  getAddresses(@Param('customerId') customerId: number) {
    return this.customersService.getAddresses(customerId);
  }

  @Post(':customerId/addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar dirección al cliente' })
  @ApiResponse({ status: 201, description: 'Dirección agregada' })
  addAddress(
    @Param('customerId') customerId: number,
    @Param('addressId') addressId: number,
  ) {
    return this.customersService.addAddress(customerId, addressId);
  }

  @Delete(':customerId/addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover dirección del cliente' })
  @ApiResponse({ status: 200, description: 'Dirección removida' })
  removeAddress(
    @Param('customerId') customerId: number,
    @Param('addressId') addressId: number,
  ) {
    return this.customersService.removeAddress(customerId, addressId);
  }
}