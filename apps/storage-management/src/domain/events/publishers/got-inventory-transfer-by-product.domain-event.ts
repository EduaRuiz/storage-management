import { Observable } from 'rxjs';
import { InventoryTransferDomainModel } from '../../models';

export abstract class GotInventoryTransferByProductDomainEvent<
  Response = InventoryTransferDomainModel[],
> {
  abstract publish(transfers: Response): Observable<Response>;
}
