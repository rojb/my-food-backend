import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'mail@mail.com' })
    @IsString()
    @IsNotEmpty()
    email: string;


    @ApiProperty({ example: 'Perez' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}