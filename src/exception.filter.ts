import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('Exception caught:', {
      exception,
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
      path: request.url,
      method: request.method,
      body: request.body,
      headers: request.headers,
    });

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const error =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            details: process.env.NODE_ENV === 'development' ? exception : undefined,
          };

    response.status(status).json(error);
  }
}
