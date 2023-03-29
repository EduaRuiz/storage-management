import { Observable } from 'rxjs';
import { StockDomainModel } from '../models';

export interface IStockDomainService<
  Entity extends StockDomainModel = StockDomainModel,
> {
  createStock(entity: Entity): Observable<Entity>;
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  findOneByLocationIdAndProductId(
    locationId: string,
    productId: string,
  ): Observable<Entity>;
  findOneById(entityId: string): Observable<Entity>;
}
