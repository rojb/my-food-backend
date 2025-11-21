import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TelegramLoginDto } from './dto/telegram-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('telegram-login')
  @ApiOperation({ summary: 'Login con Telegram' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna JWT token' })
  async telegramLogin(@Body() loginDto: TelegramLoginDto) {
    return this.authService.telegramLogin(loginDto);
  }
}