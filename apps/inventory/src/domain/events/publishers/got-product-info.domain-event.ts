import { ProductDomainEntity } from '../../entities';
import { Observable } from 'rxjs';

export abstract class GotProductInfoDomainEvent<
  Response = ProductDomainEntity,
> {
  abstract publish(product: Response): Observable<Response>;
}
