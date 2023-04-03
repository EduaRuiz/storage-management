import { Observable, tap, switchMap } from 'rxjs';
import { ILocationDomainService } from '../../domain/services';
import { LocationDomainModel } from '../../domain/models';
import { IUpdateLocationDomainDto } from '../../domain/dtos';
import { UpdatedLocationInfoDomainEvent } from '../../domain/events/publishers';

/**
 * Caso de uso de actualizar información de ubicación
 *
 * @export
 * @class UpdateLocationInfoUseCase
 */
export class UpdateLocationInfoUseCase {
  /**
   * Crea una instancia de UpdateLocationInfoUseCase
   *
   * @param {ILocationDomainService} location$ Servicio de dominio de ubicación
   * @param {UpdatedLocationInfoDomainEvent} updatedLocationInfoDomainEvent Evento de dominio de información de ubicación actualizada
   * @memberof UpdateLocationInfoUseCase
   */
  constructor(
    private readonly location$: ILocationDomainService,
    private readonly updatedLocationInfoDomainEvent: UpdatedLocationInfoDomainEvent,
  ) {}

  /**
   * Ejecutar caso de uso y publicar evento de dominio
   *
   * @param {string} entityId Id de ubicación
   * @param {IUpdateLocationDomainDto} dto Dto de actualización de ubicación
   * @return {Observable<LocationDomainModel>} Observable de ubicación
   * @memberof UpdateLocationInfoUseCase
   */
  execute(
    entityId: string,
    dto: IUpdateLocationDomainDto,
  ): Observable<LocationDomainModel> {
    return this.location$.getLocationById(entityId).pipe(
      switchMap((entity: LocationDomainModel) => {
        entity = {
          name: entity.name,
          description: entity.description,
          address: entity.address,
          ...dto,
          _id: entityId,
        };
        return this.location$.updateLocation(entityId, entity).pipe(
          tap((entity: LocationDomainModel) => {
            this.updatedLocationInfoDomainEvent.publish(entity);
          }),
        );
      }),
    );
  }
}
