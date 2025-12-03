import { IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DeliveryResponse {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

export class DeliveryAssignmentResponseDto {
  @ApiProperty({ enum: DeliveryResponse })
  @IsEnum(DeliveryResponse)
  response: DeliveryResponse;
}