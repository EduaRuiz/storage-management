import { ProductDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class RemovedProductDomainEvent<Response = ProductDomainModel> {
  abstract publish(product: Response): Observable<Response>;
}
