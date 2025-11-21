import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ProductRating } from './entities/product-rating.entity';

@Injectable()
export class RatingsService {
    constructor(
        @InjectRepository(ProductRating)
        private ratingRepository: Repository<ProductRating>,
    ) { }

    async create(createRatingDto: CreateRatingDto, customerId: number): Promise<ProductRating> {
        const rating = this.ratingRepository.create({
            ...createRatingDto,
            customerId,
        });
        return this.ratingRepository.save(rating);
    }

    async findByProduct(productId: number): Promise<ProductRating[]> {
        return this.ratingRepository.find({
            where: { productId },
            relations: ['customer'],
        });
    }

    async findByCustomer(customerId: number): Promise<ProductRating[]> {
        return this.ratingRepository.find({
            where: { customerId },
            relations: ['product'],
        });
    }

    async remove(id: number): Promise<{ message: string }> {
        const rating = await this.ratingRepository.findOne({ where: { id } });
        if (!rating) {
            throw new NotFoundException(`Rating ${id} no encontrado`);
        }
        await this.ratingRepository.remove(rating);
        return { message: 'Rating eliminado correctamente' };
    }

    async getAverageRating(productId: number): Promise<number> {
        const result = await this.ratingRepository
            .createQueryBuilder('rating')
            .select('AVG(rating.rating)', 'average')
            .where('rating.productId = :productId', { productId })
            .getRawOne();

        return result?.average ? parseFloat(result.average) : 0;
    }
}
