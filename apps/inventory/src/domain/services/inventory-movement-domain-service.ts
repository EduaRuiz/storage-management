import { Observable } from 'rxjs';
import { InventoryMovementDomainEntity } from '../entities/inventory-movement.domain-entity';

export interface IInventoryMovementDomainService<
  Entity extends InventoryMovementDomainEntity = InventoryMovementDomainEntity,
> {
  create(stockId: string, entity: Entity): Observable<Entity>;
  findAllByStockId(stockId: string): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
