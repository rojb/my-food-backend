import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentCustomer } from 'src/common/decorators/current-customer.decorator';
import { Customer } from '../customers/entities/customer.entity';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Agregar producto a favoritos' })
    @ApiResponse({ status: 201, description: 'Agregado a favoritos' })
    add(
        @Body() createFavoriteDto: CreateFavoriteDto,
        @CurrentCustomer() customer: Customer,
    ) {
        return this.favoritesService.add(customer.id, createFavoriteDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener favoritos del cliente' })
    @ApiResponse({ status: 200, description: 'Lista de favoritos' })
    findByCustomer(@CurrentCustomer() customer: Customer) {
        return this.favoritesService.findByCustomer(customer.id);
    }

    @Get(':productId/is-favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verificar si es favorito' })
    @ApiResponse({ status: 200, description: 'Si es favorito o no' })
    isFavorite(
        @Param('productId') productId: number,
        @CurrentCustomer() customer: Customer,
    ) {
        return this.favoritesService.isFavorite(customer.id, productId);
    }

    @Delete(':productId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remover de favoritos' })
    @ApiResponse({ status: 200, description: 'Removido de favoritos' })
    remove(
        @Param('productId') productId: number,
        @CurrentCustomer() customer: Customer,
    ) {
        return this.favoritesService.remove(customer.id, productId);
    }
}