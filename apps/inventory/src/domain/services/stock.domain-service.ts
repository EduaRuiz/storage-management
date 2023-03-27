import { Observable } from 'rxjs';
import { StockDomainEntity } from '../entities';

export interface IStockDomainService<
  Entity extends StockDomainEntity = StockDomainEntity,
> {
  createStock(productId: string, entity: Entity): Observable<Entity>;
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  findAllByProductId(productId: string): Observable<Entity[]>;
  findAllByLocationId(locationId: string): Observable<Entity[]>;
  findByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Observable<Entity>;
  findOneById(entityId: string): Observable<Entity>;
}
