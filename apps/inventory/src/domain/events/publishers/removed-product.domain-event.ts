import { ProductDomainEntity } from '../../entities';
import { Observable } from 'rxjs';

export abstract class RemovedProductDomainEvent<
  Response = ProductDomainEntity,
> {
  abstract publish(product: Response): Observable<Response>;
}
