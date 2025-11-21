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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentCustomer } from 'src/common/decorators/current-customer.decorator';
import { Customer } from '../customers/entities/customer.entity';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
    constructor(private ratingsService: RatingsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear calificación para un producto' })
    @ApiResponse({ status: 201, description: 'Calificación creada' })
    create(
        @Body() createRatingDto: CreateRatingDto,
        @CurrentCustomer() customer: Customer,
    ) {
        return this.ratingsService.create(createRatingDto, customer.id);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Obtener calificaciones de un producto' })
    @ApiResponse({ status: 200, description: 'Lista de calificaciones' })
    findByProduct(@Param('productId') productId: number) {
        return this.ratingsService.findByProduct(productId);
    }

    @Get('product/:productId/average')
    @ApiOperation({ summary: 'Obtener promedio de calificación de un producto' })
    @ApiResponse({ status: 200, description: 'Promedio de calificación' })
    getAverageRating(@Param('productId') productId: number) {
        return this.ratingsService.getAverageRating(productId);
    }

    @Get('customer/:customerId')
    @ApiOperation({ summary: 'Obtener calificaciones de un cliente' })
    @ApiResponse({ status: 200, description: 'Lista de calificaciones' })
    findByCustomer(@Param('customerId') customerId: number) {
        return this.ratingsService.findByCustomer(customerId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar calificación' })
    @ApiResponse({ status: 200, description: 'Calificación eliminada' })
    remove(@Param('id') id: number) {
        return this.ratingsService.remove(id);
    }
}