import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:1645',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
