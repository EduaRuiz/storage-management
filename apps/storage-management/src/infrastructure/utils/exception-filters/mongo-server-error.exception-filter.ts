import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';

/**
 * Filtro de excepción de error de servidor de MongoDB
 *
 * @export
 * @class MongoServerErrorExceptionFilter
 * @implements {ExceptionFilter<MongoServerError>}
 */
@Catch(MongoServerError)
export class MongoServerErrorExceptionFilter
  implements ExceptionFilter<MongoServerError>
{
  /**
   * Captura la excepción de error de servidor de MongoDB
   *
   * @param {MongoServerError} exception Excepción de error de servidor de MongoDB
   * @param {ArgumentsHost} host Argumentos de host
   * @memberof MongoServerErrorExceptionFilter
   */
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const message = exception.message;
    const statusCode = HttpStatus.CONFLICT;
    const details = exception;

    response.status(statusCode).json({ statusCode, message, details });
  }
}
