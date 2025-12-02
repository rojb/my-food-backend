import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/modules/orders/entities/order-status.entity';

@Injectable()
export class OrderStatusSeeder {
    constructor(
        @InjectRepository(OrderStatus)
        private orderStatusRepository: Repository<OrderStatus>,
    ) { }

    async seed() {
        const statuses = [
            { name: 'Pendiente de confirmar' },
            { name: 'Confirmado' },
            { name: 'Preparando' },
            { name: 'En camino' },
            { name: 'Entregado' },

        ];

        for (const status of statuses) {
            const exists = await this.orderStatusRepository.findOne({
                where: { name: status.name },
            });
            if (!exists) {
                await this.orderStatusRepository.save(status);
            }
        }
        console.log('✓ OrderStatus seeded');
    }
}


