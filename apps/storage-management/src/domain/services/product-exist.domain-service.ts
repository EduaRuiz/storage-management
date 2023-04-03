import { IProductExist } from '../interfaces/data-out-context';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Servicio de dominio de existencia de producto
 *
 * @export
 * @interface IProductExistDomainService
 */
export interface IProductExistDomainService {
  /**
   * Verificar existencia de producto
   *
   * @param {string} productId Identificador de producto
   * @param {string} token Token de autenticación de usuario
   * @return {Observable<IProductExist>} Observable de producto existente
   * @memberof IProductExistDomainService
   */
  exist(productId: string, token: string): Observable<IProductExist>;
}
