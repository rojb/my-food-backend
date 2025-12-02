import { Address } from "src/modules/addresses/entities/address.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('restaurant')
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'address_id' })
    addressId: number;

    @Column({ name: 'is_open', default: true })
    isOpen: boolean;

    @ManyToOne(() => Address)
    @JoinColumn({name: 'address_id'})
    address: Address;
}