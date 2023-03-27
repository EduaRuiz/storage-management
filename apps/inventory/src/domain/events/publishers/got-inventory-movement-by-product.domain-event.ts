import { Observable } from 'rxjs';
import { InventoryMovementDomainEntity } from '../../entities';

export abstract class GotInventoryByProductDomainEvent<
  Response = InventoryMovementDomainEntity[],
> {
  abstract publish(movements: Response): Observable<Response>;
}
