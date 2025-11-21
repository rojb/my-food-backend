import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MyFood API')
    .setDescription('API para gestión de pedidos de restaurante')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación por Telegram')
    .addTag('Products', 'Gestión de productos')
    .addTag('Orders', 'Gestión de órdenes')
    .addTag('Categories', 'Gestión de categorías')
    .addTag('Addresses', 'Gestión de direcciones')
    .addTag('Customers', 'Gestión de clientes')
    .addTag('Drivers', 'Gestión de conductores')
    .addTag('Ratings', 'Calificaciones de productos')
    .addTag('Favorites', 'Productos favoritos')
    .build();


  const document = SwaggerModule.createDocument(app, config);
  app.enableCors();
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
