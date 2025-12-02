import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/modules/addresses/entities/address.entity';

@Injectable()
export class AddressSeeder {
    constructor(
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
    ) { }

    async seed() {
        const addresses = [
            {
                name: 'Restaurante Centro',
                description: 'Ubicado en el centro de la ciudad',
                coordinateX: -16.489385,
                coordinateY: -68.119294,

            },
            {
                name: 'Restaurante Sur',
                description: 'Zona sur de la ciudad',
                coordinateX: -16.589385,
                coordinateY: -68.219294,

            },
            {
                name: 'Casa Principal',
                description: 'Mi casa principal',
                coordinateX: -16.389385,
                coordinateY: -68.119294,

            },
        ];

        for (const address of addresses) {
            const exists = await this.addressRepository.findOne({
                where: { name: address.name },
            });
            if (!exists) {
                await this.addressRepository.save(address);
            }
        }
        console.log('✓ Addresses seeded');
    }
}