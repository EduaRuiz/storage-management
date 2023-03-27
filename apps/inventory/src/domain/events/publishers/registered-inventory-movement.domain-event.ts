import { InventoryMovementDomainEntity } from '../../entities';
import { Observable } from 'rxjs';

export abstract class RegisteredInventoryMovementDomainEvent<
  Response = InventoryMovementDomainEntity,
> {
  abstract publish(inventoryMovement: Response): Observable<Response>;
}
