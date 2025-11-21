import { Delivery } from "src/modules/deliveries/entities/delivery.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('drivers')
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column()
    password: string;

    @OneToMany(() => Delivery, (delivery) => delivery.driver, { cascade: true })
    deliveries: Delivery[];
}
