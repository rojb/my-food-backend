import { Category } from "src/modules/categories/entities/category.entity";
import { OrderProduct } from "src/modules/orders/entities/order-products.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductRating } from "./product-rating.entity";
import { FavoriteCustomerProduct } from "./favorite-customer-products.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'currency' })
    currency: string;

    @Column({ nullable: true })
    image: string;

    @Column({ name: 'category_id' })
    categoryId: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;


    @OneToMany(() => OrderProduct, (op) => op.product, { cascade: true })
    orderProducts: OrderProduct[];

    @OneToMany(() => ProductRating, (rating) => rating.product, { cascade: true })
    ratings: ProductRating[];

    @OneToMany(() => FavoriteCustomerProduct, (fav) => fav.product, { cascade: true })
    favorites: FavoriteCustomerProduct[];
}