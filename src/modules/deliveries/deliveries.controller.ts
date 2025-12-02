import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nueva entrega' })
  @ApiResponse({ status: 201, description: 'Entrega creada' })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las entregas' })
  @ApiResponse({ status: 200, description: 'Lista de entregas' })
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Get('/driver/grouped/:driverId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener entregas agrupadas por estado' })
  @ApiResponse({ status: 200, description: 'Entregas organizadas por estado' })
  findByDriverGrouped(@Param('driverId') driverId: number) {
    return this.deliveriesService.findByDriverGrouped(driverId);
  }

  @Get('/driver/:driverId')
  @ApiOperation({ summary: 'Obtener entregas de un conductor' })
  @ApiResponse({ status: 200, description: 'Lista de entregas del conductor' })
  findByDriver(@Param('driverId') driverId: number) {
    return this.deliveriesService.findByDriver(driverId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener entrega por ID' })
  @ApiResponse({ status: 200, description: 'Datos de la entrega' })
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(+id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de la entrega' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateDeliveryStatusDto,
  ) {
    return this.deliveriesService.updateStatus(+id, updateStatusDto.status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar entrega' })
  @ApiResponse({ status: 200, description: 'Entrega actualizada' })
  update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveriesService.update(+id, updateDeliveryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  remove(@Param('id') id: string) {
    return this.deliveriesService.remove(+id);
  }
}