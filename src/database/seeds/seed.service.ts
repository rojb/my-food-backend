import { Injectable } from '@nestjs/common';
import { OrderStatusSeeder } from './order-status.seeder';
/*
import { CategorySeeder } from './category.seeder';
import { AddressSeeder } from './address.seeder';
import { CustomerSeeder } from './customer.seeder'; */
import { DriverSeeder } from './driver.seeder';
/* import { ProductSeeder } from './product.seeder'; */

@Injectable()
export class SeedService {
    constructor(
        private orderStatusSeeder: OrderStatusSeeder,
        /*
       private categorySeeder: CategorySeeder,
       private addressSeeder: AddressSeeder,
       private customerSeeder: CustomerSeeder, */
        private driverSeeder: DriverSeeder,
        /*         private productSeeder: ProductSeeder, */
    ) { }

    async seed() {
        console.log('🌱 Iniciando seeders...');
        try {
            // El orden importa: primero OrderStatus, Categories, luego Products que dependen de Categories
            await this.orderStatusSeeder.seed();
            /* 
              await this.categorySeeder.seed();
              await this.customerSeeder.seed(); */
            await this.driverSeeder.seed();
            /*             await this.addressSeeder.seed();
                        await this.productSeeder.seed(); */
            console.log('✅ Seeders completados exitosamente');
        } catch (error) {
            console.error('❌ Error al ejecutar seeders:', error);
            throw error;
        }
    }
}