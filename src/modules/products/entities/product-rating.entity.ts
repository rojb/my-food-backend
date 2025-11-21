import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";

@Entity('product_ratings')
export class ProductRating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column()
    email: string;

    @Column()
    rating: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'date' })
    date: Date;

    @ManyToOne(() => Product, (product) => product.ratings)
    product: Product;

    @ManyToOne(() => Customer, (customer) => customer.ratings)
    customer: Customer;
}