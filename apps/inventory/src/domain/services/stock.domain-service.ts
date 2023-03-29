import { Observable } from 'rxjs';
import { StockDomainModel } from '../models';

export interface IStockDomainService<
  Entity extends StockDomainModel = StockDomainModel,
> {
  createStock(entity: Entity): Observable<Entity>;
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  findAllByProductId(productId: string): Observable<Entity[]>;
  findAllByLocationId(locationId: string): Observable<Entity[]>;
  findByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Observable<Entity>;
  findOneById(entityId: string): Observable<Entity>;
}
