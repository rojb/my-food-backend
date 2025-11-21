import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    productId: number;

    @ApiProperty({ example: 2 })
    @IsNumber()
    quantity: number;
}
