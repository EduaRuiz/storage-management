import { Observable } from 'rxjs';
import { StockDomainModel } from '../models';

export interface IStockDomainService<
  Entity extends StockDomainModel = StockDomainModel,
> {
  createStock(productId: string, entity: Entity): Observable<Entity>;
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  findOneById(entityId: string): Observable<Entity>;
}
