import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) { }

import { DeliveryStatus } from '../entities/delivery.entity';

export class DeliveryDetailDto {
    id: number;
    orderId: number;
    status: DeliveryStatus;
    createdAt: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    order: {
        id: number;
        total: number;
        deliveryPrice: number;
        date: Date;
        customer: {
            id: number;
            name: string;
            lastName: string;
            telegramId: string;
        };
        address: {
            id: number;
            name: string;
            description: string;
            coordinateX: number;
            coordinateY: number;
        };
        orderProducts: Array<{
            id: number;
            quantity: number;
            product: {
                id: number;
                name: string;
                price: number;
                currency: string;
            };
        }>;
    };
}

export class DeliveriesByStatusDto {
    pending: DeliveryDetailDto[];
    accepted: DeliveryDetailDto[];
    active: DeliveryDetailDto[];
    completed: DeliveryDetailDto[];
    cancelled: DeliveryDetailDto[];
}