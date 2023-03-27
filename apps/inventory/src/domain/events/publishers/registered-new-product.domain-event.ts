import { ProductDomainEntity } from '../../entities';
import { Observable } from 'rxjs';

export abstract class RegisteredNewProductDomainEvent<
  Response = ProductDomainEntity,
> {
  abstract publish(product: Response): Observable<Response>;
}
