import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from 'src/modules/drivers/entities/driver.entity';

@Injectable()
export class DriverSeeder {
    constructor(
        @InjectRepository(Driver)
        private driverRepository: Repository<Driver>,
    ) { }

    async seed() {
        const drivers = [
            {
                name: 'Roberto',
                lastName: 'Martínez',
                password: 'password123',
                isAvailable: true,
            },
            {
                name: 'Felipe',
                lastName: 'Rodríguez',
                password: 'password123',
                isAvailable: true,
            },
            {
                name: 'Diego',
                lastName: 'Fernández',
                password: 'password123',
                isAvailable: false,
            },
        ];

        for (const driver of drivers) {
            const exists = await this.driverRepository.findOne({
                where: { name: driver.name, lastName: driver.lastName },
            });
            if (!exists) {
                await this.driverRepository.save(driver);
            }
        }
        console.log('✓ Drivers seeded');
    }
}