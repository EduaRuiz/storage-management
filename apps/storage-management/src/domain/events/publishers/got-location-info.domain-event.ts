import { LocationDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class GotLocationInfoDomainEvent<
  Response = LocationDomainModel,
> {
  abstract publish(location: Response): Observable<Response>;
}
