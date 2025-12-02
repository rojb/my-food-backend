import { CustomerAddress } from "src/modules/addresses/entities/customer-address.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./order-products.entity";
import { OrderStatus } from "./order-status.entity";
import { Delivery } from "src/modules/deliveries/entities/delivery.entity";
import { Address } from "src/modules/addresses/entities/address.entity";

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

    @Column({ name: 'address_id' })
    addressId: number;

    @Column({ name: 'order_status_id', default: 1 })
    orderStatusId: number;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => Address, { cascade: true })
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @ManyToOne(() => OrderStatus)
     @JoinColumn({ name: 'order_status_id' })
    orderStatus: OrderStatus;

    @OneToMany(() => OrderProduct, (op) => op.order, { cascade: true })
    orderProducts: OrderProduct[];

    @OneToMany(() => Delivery, (delivery) => delivery.order, { cascade: true })
    deliveries: Delivery[];
}