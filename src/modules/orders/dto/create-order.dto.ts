import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { OrderProductDto } from "src/modules/orders/dto/order-product.dto";

export class CreateOrderDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    customerAddressId: number;

    @ApiProperty({ example: 5.99 })
    @IsNumber()
    deliveryPrice: number;

    @ApiProperty({ example: [{ productId: 1, quantity: 2 }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderProductDto)
    products: OrderProductDto[];

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    orderStatusId?: number;
}