import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import express = require('express');
dotenv.config();

const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Setup swagger api document
  app.enableCors({
    origin: ['https://paycheck-dashboard.vercel.app', 'http://localhost:3000'], // Whitelist specific origins
  });
  const options = new DocumentBuilder()
    .setTitle('Paycheck API')
    .setDescription('API documentation for Paycheck project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs/api', app, document, customOptions);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use('/home/paycheck_dev/image-files', express.static('/home/paycheck_dev/image-files'));
  app.use('/home/paycheck_dev/invoice-files', express.static('/home/paycheck_dev/invoice-files'));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
