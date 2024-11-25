import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const responseMessage =
      exception instanceof HttpException ? exception.getResponse() : '';

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorStack = exception instanceof Error ? exception.stack : '';

    this.loggingService.error(
      `
  ${new Date()}
Request: 
    url: ${request.url} 
    query: ${JSON.stringify(request.query)} 
    body: ${JSON.stringify(request.body)} 
Response: 
    statusCode: ${httpStatus}
${errorStack === '' ? '' : `Error Stack: ${errorStack}`}
`,
    );

    response.status(httpStatus).json({
      timestamp: new Date(),
      path: request.url,
      ...(typeof responseMessage === 'string' ? {} : responseMessage),
    });
  }
}
