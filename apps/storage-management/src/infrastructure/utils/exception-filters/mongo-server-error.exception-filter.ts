import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongoServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
