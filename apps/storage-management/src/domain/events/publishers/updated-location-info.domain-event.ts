import { LocationDomainModel } from '../../models';
import { Observable } from 'rxjs';

/**
 * Evento de dominio de información de ubicación actualizada
 *
 * @export
 * @abstract
 * @class UpdatedLocationInfoDomainEvent
 * @template Response
 */
export abstract class UpdatedLocationInfoDomainEvent<
  Response = LocationDomainModel,
> {
  /**
   * Publicar evento de dominio
   *
   * @abstract
   * @param {Response} location Ubicación
   * @return {Observable<Response>} Observable de ubicación
   * @memberof UpdatedLocationInfoDomainEvent
   */
  abstract publish(location: Response): Observable<Response>;
}
