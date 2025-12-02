import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '../entities/delivery.entity';

export class UpdateDeliveryStatusDto {
    @ApiProperty({ enum: DeliveryStatus })
    @IsEnum(DeliveryStatus)
    status: DeliveryStatus;
}