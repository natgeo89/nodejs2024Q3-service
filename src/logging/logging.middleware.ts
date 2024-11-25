import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { url, query, body } = req;
    const { statusCode } = res;

    res.on('finish', () => {
      this.loggingService.log(
        `
${new Date()}
Request: 
    url: ${url} 
    query: ${JSON.stringify(query)} 
    body: ${JSON.stringify(body)} 
Response: 
    statusCode: ${statusCode}
`,
        'MIDDLEWARE',
      );
    });

    next();
  }
}
