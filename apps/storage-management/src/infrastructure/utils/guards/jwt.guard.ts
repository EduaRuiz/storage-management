import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, map, of, switchMap, catchError } from 'rxjs';
import * as jwt from 'jsonwebtoken';

/**
 * Guard de JWT para autenticación de usuarios
 *
 * @export
 * @class JwtGuard
 * @implements {CanActivate}
 */
@Injectable()
export class JwtGuard implements CanActivate {
  /**
   * Verifica si el usuario está autenticado
   *
   * @param {ExecutionContext} context Contexto de ejecución
   * @return {Observable<boolean>} Observable de booleano
   * @memberof JwtGuard
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    return of(token).pipe(
      map((token) => (token ? jwt.verify(token, 'll4v3') : null)),
      catchError((err: Error) => {
        throw new UnauthorizedException(err.message);
      }),
      switchMap((decoded) => (decoded ? of(true) : of(false))),
    );
  }
}
