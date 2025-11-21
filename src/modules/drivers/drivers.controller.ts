import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private driversService: DriversService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo conductor' })
  @ApiResponse({ status: 201, description: 'Conductor creado' })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los conductores' })
  @ApiResponse({ status: 200, description: 'Lista de conductores' })
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener conductor por ID' })
  @ApiResponse({ status: 200, description: 'Datos del conductor' })
  findById(@Param('id') id: number) {
    return this.driversService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar conductor' })
  @ApiResponse({ status: 200, description: 'Conductor eliminado' })
  remove(@Param('id') id: number) {
    return this.driversService.remove(id);
  }
}