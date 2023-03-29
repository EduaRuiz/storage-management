import { Observable } from 'rxjs';
import { InventoryMovementDomainModel } from '../../models';

export abstract class GotInventoryMovementByProductDomainEvent<
  Response = InventoryMovementDomainModel[],
> {
  abstract publish(movements: Response): Observable<Response>;
}
