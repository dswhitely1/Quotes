import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configService } from './config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (!configService.isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Quotes API')
        .setDescription('LabsPT8 Spring Break with the Wizard')
        .addTag('Quotes')
        .setVersion('0.0.1')
        .build(),
    );

    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(configService.getPort());
}
bootstrap();
