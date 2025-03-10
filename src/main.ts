import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const configApi = new DocumentBuilder()
    .setTitle('Веб UI тестовых запросов')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configApi);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
