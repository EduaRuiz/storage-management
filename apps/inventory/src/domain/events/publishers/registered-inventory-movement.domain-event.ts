import { InventoryMovementDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class RegisteredInventoryMovementDomainEvent<
  Response = InventoryMovementDomainModel,
> {
  abstract publish(inventoryMovement: Response): Observable<Response>;
}
