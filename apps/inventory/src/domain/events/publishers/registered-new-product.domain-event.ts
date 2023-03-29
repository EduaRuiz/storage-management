import { Observable } from 'rxjs';
import { ProductDomainModel } from '../../models';

export abstract class RegisteredNewProductDomainEvent<
  Response = ProductDomainModel,
> {
  abstract publish(product: Response): Observable<Response>;
}
