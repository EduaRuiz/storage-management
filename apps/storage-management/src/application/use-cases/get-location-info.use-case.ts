import { Observable, tap } from 'rxjs';
import { GotLocationInfoDomainEvent } from '../../domain/events/publishers';
import { ILocationDomainService } from '../../domain/services';
import { LocationDomainModel } from '../../domain/models';
export class GetLocationInfoUseCase {
  constructor(
    private readonly location$: ILocationDomainService,
    private readonly gotLocationInfoDomainEvent: GotLocationInfoDomainEvent,
  ) {}

  execute(entityId: string): Observable<LocationDomainModel> {
    return this.location$.getLocationById(entityId).pipe(
      tap((entity: LocationDomainModel) => {
        this.gotLocationInfoDomainEvent.publish(entity);
      }),
    );
  }
}
