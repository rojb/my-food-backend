import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @ManyToOne(() => Order, (order) => order.deliveries)
  order: Order;

  @ManyToOne(() => Driver, (driver) => driver.deliveries)
  driver: Driver;
}