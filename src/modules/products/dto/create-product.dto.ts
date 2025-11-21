import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Pizza Margherita' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Deliciosa pizza con queso mozzarella' })
    @IsString()
    description: string;

    @ApiProperty({ example: 12.99 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'USD' })
    @IsString()
    currency: string;

    @ApiProperty({ example: 'https://example.com/pizza.jpg', required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    categoryId: number;

    @ApiProperty({ example: true, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
