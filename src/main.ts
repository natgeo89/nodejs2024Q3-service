import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './exceptionFilter/exceptionFilter';
import { LoggingInterceptor } from './logging/logging.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.useGlobalFilters(new CustomExceptionFilter(loggingService));

  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

  const swaggerDocument = YAML.load('./doc/api.yaml');

  SwaggerModule.setup('doc', app, swaggerDocument);

  process.on('uncaughtException', (error) => {
    loggingService.error(`exception- ${error.message}`);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(`rejection reason: ${reason}`);
  });

  await app.listen(process.env.PORT);
}
bootstrap();
