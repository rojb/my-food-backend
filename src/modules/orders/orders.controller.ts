import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentCustomer } from 'src/common/decorators/current-customer.decorator';
import { Customer } from '../customers/entities/customer.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentCustomer() customer: Customer,
  ) {
    return this.ordersService.create(createOrderDto, customer.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener órdenes del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes' })
  findAll(@CurrentCustomer() customer: Customer) {
    return this.ordersService.findAll(customer.id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({ status: 200, description: 'Lista de todas las órdenes' })
  findAllOrders() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiResponse({ status: 200, description: 'Datos de la orden' })
  findById(@Param('id') id: number) {
    return this.ordersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada' })
  update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar orden' })
  @ApiResponse({ status: 200, description: 'Orden eliminada' })
  remove(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
}