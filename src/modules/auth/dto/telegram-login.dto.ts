import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TelegramLoginDto {
    @ApiProperty({ example: '123456789' })
    @IsString()
    @IsNotEmpty()
    telegramId: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
}