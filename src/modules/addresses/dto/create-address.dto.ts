import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
    @ApiProperty({ example: 'Casa' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Mi casa principal' })
    @IsString()
    description: string;

    @ApiProperty({ example: -16.389385 })
    @IsNumber()
    coordinateX: number;

    @ApiProperty({ example: -68.119294 })
    @IsNumber()
    coordinateY: number;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber()
    restaurantId?: number;
}