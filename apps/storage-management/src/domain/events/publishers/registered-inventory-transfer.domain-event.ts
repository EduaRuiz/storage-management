import { InventoryTransferDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class RegisteredInventoryTransferDomainEvent<
  Response = InventoryTransferDomainModel,
> {
  abstract publish(inventoryTransfer: Response): Observable<Response>;
}
