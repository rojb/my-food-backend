import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private addressesService: AddressesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva dirección' })
  @ApiResponse({ status: 201, description: 'Dirección creada' })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las direcciones' })
  @ApiResponse({ status: 200, description: 'Lista de direcciones' })
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener dirección por ID' })
  @ApiResponse({ status: 200, description: 'Datos de la dirección' })
  findById(@Param('id') id: number) {
    return this.addressesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar dirección' })
  @ApiResponse({ status: 200, description: 'Dirección actualizada' })
  update(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar dirección' })
  @ApiResponse({ status: 200, description: 'Dirección eliminada' })
  remove(@Param('id') id: number) {
    return this.addressesService.remove(id);
  }
}