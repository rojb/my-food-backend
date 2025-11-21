import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_status')
export class OrderStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}