import { Observable } from 'rxjs';
import { InventoryTransferDomainModel } from '../../models';

export abstract class GotInventoryTransferByLocationDomainEvent<
  Response = InventoryTransferDomainModel[],
> {
  abstract publish(transfers: Response): Observable<Response>;
}
