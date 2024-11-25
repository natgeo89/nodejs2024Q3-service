import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './exceptionFilter/exceptionFilter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.useLogger(loggingService);

  app.useGlobalFilters(new CustomExceptionFilter(loggingService));

  const swaggerDocument = YAML.load('./doc/api.yaml');

  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(process.env.PORT);
}
bootstrap();
