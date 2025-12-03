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
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { DriverJwtAuthGuard } from 'src/common/guards/driver-jwt-auth.guard';
import { CurrentDriver } from 'src/common/decorators/current-driver.decorator';
import { Driver } from '../drivers/entities/driver.entity';
import { DeliveryStatus } from './entities/delivery.entity';
import { DeliveryAssignmentResponseDto } from './dto/assigment.dto';

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) { }

  @Post(':orderId/assign')
  @ApiOperation({ summary: 'Iniciar asignación de entrega a conductores' })
  @ApiResponse({
    status: 201,
    description: 'Asignación iniciada, notificación enviada',
  })
  async assignDelivery(@Param('orderId') orderId: number) {
    await this.deliveriesService.initiateDeliveryAssignment(orderId);
    return {
      message: 'Notificación enviada al conductor más cercano',
      orderId,
    };
  }

  @Post(':orderId/driver/:driverId/response')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Conductor acepta o rechaza la entrega' })
  @ApiResponse({ status: 200, description: 'Respuesta procesada' })
  async respondToDelivery(
    @Param('orderId') orderId: number,
    @Param('driverId') driverId: number,
    @Body() responseDto: DeliveryAssignmentResponseDto,
  ) {
    return this.deliveriesService.handleDeliveryResponse(
      orderId,
      driverId,
      responseDto.response,
    );
  }

  @Get('driver/:driverId/pending')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener entregas pendientes del conductor' })
  @ApiResponse({ status: 200, description: 'Lista de entregas pendientes' })
  async getPendingDeliveries(@Param('driverId') driverId: number) {
    return this.deliveriesService.getPendingDeliveries(driverId);
  }

  @Get('driver/:driverId/by-status')
  @UseGuards(DriverJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener entregas del conductor agrupadas por estado',
  })
  @ApiResponse({
    status: 200,
    description: 'Entregas agrupadas por estado',
  })
  async getDeliveriesByStatus(@Param('driverId') driverId: number) {
    return this.deliveriesService.getDeliveriesByStatus(driverId);
  }

  @Get('driver/:driverId/status/:status')
  @UseGuards(DriverJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener entregas del conductor por estado específico',
  })
  @ApiResponse({ status: 200, description: 'Lista de entregas filtradas' })
  async getDeliveriesBySpecificStatus(
    @Param('driverId') driverId: number,
    @Param('status') status: DeliveryStatus,
  ) {
    return this.deliveriesService.getDeliveriesBySpecificStatus(
      driverId,
      status,
    );
  }

  @Get('driver/:driverId/active')
  @UseGuards(DriverJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener entrega activa actual del conductor' })
  @ApiResponse({ status: 200, description: 'Entrega activa o null' })
  async getActiveDelivery(@Param('driverId') driverId: number) {
    return this.deliveriesService.getActiveDelivery(driverId);
  }

  @Patch(':id/status')
  @UseGuards(DriverJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de la entrega' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateDeliveryStatusDto,
  ) {
    return this.deliveriesService.updateStatus(id, updateStatusDto.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener entrega por ID' })
  @ApiResponse({ status: 200, description: 'Datos de la entrega' })
  async findOne(@Param('id') id: number) {
    return this.deliveriesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(DriverJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: number) {
    return this.deliveriesService.remove(id);
  }
}