import { ProductDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class GotProductInfoDomainEvent<Response = ProductDomainModel> {
  abstract publish(product: Response): Observable<Response>;
}
