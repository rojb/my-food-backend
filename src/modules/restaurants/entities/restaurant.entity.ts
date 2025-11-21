import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}