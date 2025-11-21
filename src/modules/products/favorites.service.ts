import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteCustomerProduct } from './entities/favorite-customer-products.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(FavoriteCustomerProduct)
        private favoriteRepository: Repository<FavoriteCustomerProduct>,
    ) { }

    async add(customerId: number, createFavoriteDto: CreateFavoriteDto): Promise<FavoriteCustomerProduct> {
        const exists = await this.favoriteRepository.findOne({
            where: { customerId, productId: createFavoriteDto.productId },
        });

        if (exists) {
            throw new ConflictException('Este producto ya está en favoritos');
        }

        const favorite = this.favoriteRepository.create({
            customerId,
            productId: createFavoriteDto.productId,
        });

        return this.favoriteRepository.save(favorite);
    }

    async findByCustomer(customerId: number): Promise<FavoriteCustomerProduct[]> {
        return this.favoriteRepository.find({
            where: { customerId },
            relations: ['product'],
        });
    }

    async remove(customerId: number, productId: number): Promise<{ message: string }> {
        const favorite = await this.favoriteRepository.findOne({
            where: { customerId, productId },
        });

        if (!favorite) {
            throw new NotFoundException('Favorito no encontrado');
        }

        await this.favoriteRepository.remove(favorite);
        return { message: 'Producto removido de favoritos' };
    }

    async isFavorite(customerId: number, productId: number): Promise<boolean> {
        const favorite = await this.favoriteRepository.findOne({
            where: { customerId, productId },
        });
        return !!favorite;
    }
}