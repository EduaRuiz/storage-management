import { ProductDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class UpdatedProductInfoDomainEvent<
  Response = ProductDomainModel,
> {
  abstract publish(product: Response): Observable<Response>;
}
