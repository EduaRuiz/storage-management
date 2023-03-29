import { RegisteredNewLocationDomainEvent } from '../../domain/events/publishers';
import { ILocationDomainService } from '../../domain/services';
import { INewLocationDomainDto } from '../../domain/dtos';
import { Observable, tap } from 'rxjs';
import { LocationDomainModel } from '../../domain/models';

export class RegisterNewLocationUseCase {
  constructor(
    private readonly location$: ILocationDomainService,
    private readonly registeredNewLocationDomainEvent: RegisteredNewLocationDomainEvent,
  ) {}
  execute(dto: INewLocationDomainDto): Observable<LocationDomainModel> {
    return this.location$.createLocation(dto).pipe(
      tap((entity: LocationDomainModel) => {
        this.registeredNewLocationDomainEvent.publish(entity);
      }),
    );
  }
}
