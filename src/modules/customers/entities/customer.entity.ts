import { CustomerAddress } from "src/modules/addresses/entities/customer-address.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { FavoriteCustomerProduct } from "src/modules/products/entities/favorite-customer-products.entity";
import { ProductRating } from "src/modules/products/entities/product-rating.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ name: 'telegram_id', unique: true })
    telegramId: string;

    @OneToMany(() => Order, (order) => order.customer, { cascade: true })
    orders: Order[];

    @OneToMany(() => CustomerAddress, (addr) => addr.customer, { cascade: true })
    customerAddresses: CustomerAddress[];

    @OneToMany(() => ProductRating, (rating) => rating.customer, { cascade: true })
    ratings: ProductRating[];

    @OneToMany(() => FavoriteCustomerProduct, (fav) => fav.customer, { cascade: true })
    favorites: FavoriteCustomerProduct[];
}