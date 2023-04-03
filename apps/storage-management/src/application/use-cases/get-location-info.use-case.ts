import { Observable } from 'rxjs';
import { ILocationDomainService } from '../../domain/services';
import { LocationDomainModel } from '../../domain/models';

/**
 * Caso de uso de obtener información de ubicación
 *
 * @export
 * @class GetLocationInfoUseCase
 */
export class GetLocationInfoUseCase {
  /**
   * Crea una instancia de GetLocationInfoUseCase
   *
   * @param {ILocationDomainService} location$ Servicio de dominio de ubicación
   * @memberof GetLocationInfoUseCase
   */
  constructor(private readonly location$: ILocationDomainService) {}

  /**
   * Ejecutar caso de uso
   *
   * @param {string} entityId Id de ubicación
   * @return {Observable<LocationDomainModel>} Observable de ubicación
   * @memberof GetLocationInfoUseCase
   */
  execute(entityId: string): Observable<LocationDomainModel> {
    return this.location$.getLocationById(entityId).pipe();
  }
}
