import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as YAML from 'yamljs';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );

  const swaggerDocument = YAML.load('./doc/api.yaml');

  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(process.env.PORT);
}
bootstrap();
