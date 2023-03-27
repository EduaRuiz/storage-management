import { LocationDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class RegisteredNewLocationDomainEvent<
  Response = LocationDomainModel,
> {
  abstract publish(location: Response): Observable<Response>;
}
