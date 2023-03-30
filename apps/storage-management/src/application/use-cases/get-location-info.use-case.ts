import { Observable } from 'rxjs';
import { ILocationDomainService } from '../../domain/services';
import { LocationDomainModel } from '../../domain/models';
export class GetLocationInfoUseCase {
  constructor(private readonly location$: ILocationDomainService) {}

  execute(entityId: string): Observable<LocationDomainModel> {
    return this.location$.getLocationById(entityId).pipe();
  }
}
