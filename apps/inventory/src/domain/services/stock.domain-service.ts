import { Observable } from 'rxjs';

export interface IStockDomainService<Entity> {
  createStock(productId: string, entity: Entity): Observable<Entity>;
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  findAllByProductId(productId: string): Observable<Entity[]>;
  findAllByLocationId(locationId: string): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
