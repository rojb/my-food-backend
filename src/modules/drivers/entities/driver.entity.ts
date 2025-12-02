import { Delivery } from "src/modules/deliveries/entities/delivery.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DriverLocation } from "./driver-location.entity";

@Entity('drivers')
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'boolean', default: true, name: 'is_available' })
    isAvailable: boolean;

    @OneToMany(() => DriverLocation, (loc) => loc.driver)
    locations: DriverLocation[];

    @OneToMany(() => Delivery, (delivery) => delivery.driver, { cascade: true })
    deliveries: Delivery[];
}
