import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Driver } from "./driver.entity";

@Entity('driver_locations')
export class DriverLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", name: "driver_id" })
    driverId: number;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326
    })
    location: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Driver, driver => driver.locations)
    @JoinColumn({ name: "driver_id" })
    driver: Driver;
}
