import { Product } from "src/modules/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_products')
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'order_id' })
    orderId: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product, (product) => product.orderProducts)
    product: Product;

    @ManyToOne(() => Order, (order) => order.orderProducts)
    order: Order;
}