import { LocationDomainModel } from '../../models';
import { Observable } from 'rxjs';

/**
 * Evento de dominio de nueva ubicación registrada
 *
 * @export
 * @abstract
 * @class RegisteredNewLocationDomainEvent
 * @template Response
 */
export abstract class RegisteredNewLocationDomainEvent<
  Response = LocationDomainModel,
> {
  /**
   * Publicar evento de dominio
   *
   * @abstract
   * @param {Response} location Ubicación
   * @return {Observable<Response>} Observable de ubicación
   * @memberof RegisteredNewLocationDomainEvent
   */
  abstract publish(location: Response): Observable<Response>;
}
