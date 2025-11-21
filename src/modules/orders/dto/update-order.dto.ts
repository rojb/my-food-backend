import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    orderStatusId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    deliveryPrice?: number;
}