import { Observable } from 'rxjs';
import { InventoryMovementDomainEntity } from '../../entities';

export abstract class GotInventoryMovementByProductDomainEvent<
  Response = InventoryMovementDomainEntity[],
> {
  abstract publish(movements: Response): Observable<Response>;
}
