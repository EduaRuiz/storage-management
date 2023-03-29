import { Observable } from 'rxjs';
import { InventoryMovementDomainModel } from '../models';

export interface IInventoryMovementDomainService<
  Entity extends InventoryMovementDomainModel = InventoryMovementDomainModel,
> {
  create(entity: Entity): Observable<Entity>;
  findAllByStockId(stockId: string): Observable<Entity[]>;
  findAllByProductId(productId: string): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
