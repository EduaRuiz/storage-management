import { ILocationExist } from '../interfaces/data-out-context';
import { Observable } from 'rxjs/internal/Observable';

export interface ILocationExistDomainService {
  exist(locationId: string): Observable<ILocationExist>;
}
