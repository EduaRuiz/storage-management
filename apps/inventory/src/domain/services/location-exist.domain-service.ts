import { ILocationExist } from '../interfaces/data-out-context';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Servicio de dominio de existencia de ubicación
 *
 * @export
 * @interface ILocationExistDomainService
 */
export interface ILocationExistDomainService {
  /**
   * Verifica si una ubicación existe
   *
   * @param {string} locationId Identificador de la ubicación
   * @param {string} token Token de autenticación
   * @return  {Observable<ILocationExist>} Observable con la respuesta de la existencia de la ubicación
   * @memberof ILocationExistDomainService
   */
  exist(locationId: string, token: string): Observable<ILocationExist>;
}
