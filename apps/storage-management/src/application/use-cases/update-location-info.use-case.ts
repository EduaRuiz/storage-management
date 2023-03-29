import { Observable, tap, switchMap } from 'rxjs';
import { ILocationDomainService } from '../../domain/services';
import { LocationDomainModel } from '../../domain/models';
import { IUpdateLocationDomainDto } from '../../domain/dtos';
import { UpdatedLocationInfoDomainEvent } from '../../domain/events/publishers';

export class UpdateLocationInfoUseCase {
  constructor(
    private readonly location$: ILocationDomainService,
    private readonly updatedLocationInfoDomainEvent: UpdatedLocationInfoDomainEvent,
  ) {}

  execute(
    entityId: string,
    dto: IUpdateLocationDomainDto,
  ): Observable<LocationDomainModel> {
    return this.location$.getLocationById(entityId).pipe(
      switchMap((entity: LocationDomainModel) => {
        entity = { ...entity, ...dto, _id: entityId };
        return this.location$.updateLocation(entityId, entity).pipe(
          tap((entity: LocationDomainModel) => {
            this.updatedLocationInfoDomainEvent.publish(entity);
          }),
        );
      }),
    );
  }
}
