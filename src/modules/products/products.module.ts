import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCustomerProduct } from './entities/favorite-customer-products.entity';
import { ProductRating } from './entities/product-rating.entity';
import { RatingsService } from './ratings.service';
import { RatingsController } from './rating.controller';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, FavoriteCustomerProduct, ProductRating])],
  controllers: [ProductsController, RatingsController, FavoritesController],
  providers: [ProductsService, RatingsService, FavoritesService],
})
export class ProductsModule { }
