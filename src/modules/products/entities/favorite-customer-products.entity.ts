import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('favorite_customer_products')
export class FavoriteCustomerProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'user_id' })
    customerId: number;

    @Column({ name: 'added_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    addedAt: Date;

    @ManyToOne(() => Product, (product) => product.favorites)
    product: Product;

    @ManyToOne(() => Customer, (customer) => customer.favorites)
    customer: Customer;
}