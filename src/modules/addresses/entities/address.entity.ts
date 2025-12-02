import { Restaurant } from "src/modules/restaurants/entities/restaurant.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 6, name: 'coordinate_x' })
    coordinateX: number;

    @Column('decimal', { precision: 10, scale: 6, name: 'coordinate_y' })
    coordinateY: number;


}