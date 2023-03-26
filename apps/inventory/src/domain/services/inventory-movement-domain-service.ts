import { Observable } from 'rxjs';

export interface IInventoryMovementDomainService<Entity> {
  create(stockId: string, entity: Entity): Observable<Entity>;
  findAllByStockId(stockId: string): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
