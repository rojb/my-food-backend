import { CustomerAddress } from "src/modules/addresses/entities/customer-address.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./order-products.entity";
import { OrderStatus } from "./order-status.entity";
import { Delivery } from "src/modules/deliveries/entities/delivery.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2, name: 'delivery_price' })
    deliveryPrice: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'date' })
    date: Date;

    @Column({ name: 'customer_address_id' })
    customerAddressId: number;

    @Column({ name: 'order_status_id', default: 1 })
    orderStatusId: number;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer: Customer;

    @ManyToOne(() => CustomerAddress, { cascade: true })
    @JoinColumn({ name: 'customer_address_id' })
    customerAddress: CustomerAddress;

    @ManyToOne(() => OrderStatus)
    orderStatus: OrderStatus;

    @OneToMany(() => OrderProduct, (op) => op.order, { cascade: true })
    orderProducts: OrderProduct[];

    @OneToMany(() => Delivery, (delivery) => delivery.order, { cascade: true })
    deliveries: Delivery[];
}