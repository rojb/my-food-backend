import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
export enum DeliveryStatus {
  PENDING = 'pending',           // Pendiente de aceptar
  ACCEPTED = 'accepted',         // Aceptado pero no activo
  ACTIVE = 'active',             // En camino
  COMPLETED = 'completed',       // Entregado
  CANCELLED = 'cancelled'        // Cancelado
}
@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'driver_id' })
  driverId: number;
  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
    name: 'status'
  })
  status: DeliveryStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'accepted_at' })
  acceptedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @ManyToOne(() => Order, (order) => order.deliveries)
  order: Order;

  @ManyToOne(() => Driver, (driver) => driver.deliveries)
  driver: Driver;


}