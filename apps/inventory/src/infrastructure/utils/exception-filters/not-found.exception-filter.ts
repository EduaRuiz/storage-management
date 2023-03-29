import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

/**
 * Filtro para errores notFound
 *
 * @export
 * @class NotFoundExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  /**
   * Captura el error
   *
   * @param {NotFoundException} exception Excepción
   * @param {ArgumentsHost} host Http
   * @memberof NotFoundExceptionFilter
   */
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
    });
  }
}
