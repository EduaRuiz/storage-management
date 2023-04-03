import { RegisteredNewLocationDomainEvent } from '../../domain/events/publishers';
import { ILocationDomainService } from '../../domain/services';
import { INewLocationDomainDto } from '../../domain/dtos';
import { Observable, tap } from 'rxjs';
import { LocationDomainModel } from '../../domain/models';

/**
 * Caso de uso de registrar nueva ubicación
 *
 * @export
 * @class RegisterNewLocationUseCase
 */
export class RegisterNewLocationUseCase {
  /**
   * Crea una instancia de RegisterNewLocationUseCase
   *
   * @param {ILocationDomainService} location$ Servicio de dominio de ubicación
   * @param {RegisteredNewLocationDomainEvent} registeredNewLocationDomainEvent Evento de dominio de nueva ubicación registrada
   * @memberof RegisterNewLocationUseCase
   */
  constructor(
    private readonly location$: ILocationDomainService,
    private readonly registeredNewLocationDomainEvent: RegisteredNewLocationDomainEvent,
  ) {}

  /**
   * Ejecutar caso de uso y publicar evento de dominio
   *
   * @param {INewLocationDomainDto} dto Dto de nueva ubicación
   * @return {Observable<LocationDomainModel>} Observable de nueva ubicación
   * @memberof RegisterNewLocationUseCase
   */
  execute(dto: INewLocationDomainDto): Observable<LocationDomainModel> {
    return this.location$.createLocation(dto).pipe(
      tap((entity: LocationDomainModel) => {
        this.registeredNewLocationDomainEvent.publish(entity);
      }),
    );
  }
}
