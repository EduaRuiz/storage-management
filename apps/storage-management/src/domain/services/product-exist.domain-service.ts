import { IProductExist } from '../interfaces/data-out-context';
import { Observable } from 'rxjs/internal/Observable';

export interface IProductExistDomainService {
  exist(productId: string): Observable<IProductExist>;
}
