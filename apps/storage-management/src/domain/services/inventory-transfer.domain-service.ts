import { Observable } from 'rxjs';
import { InventoryTransferDomainModel } from '../models';

export interface IInventoryTransferDomainService<
  Entity extends InventoryTransferDomainModel = InventoryTransferDomainModel,
> {
  generateTransfer(entity: Entity): Observable<Entity>;
  getTransfersByProductId(productId: string): Observable<Entity[]>;
  getTransfersByLocationId(locationId: string): Observable<Entity[]>;
}
