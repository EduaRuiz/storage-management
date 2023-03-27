import { Observable } from 'rxjs';
import { ProductDomainEntity } from '../entities';

export interface IProductDomainService<
  Entity extends ProductDomainEntity = ProductDomainEntity,
> {
  create(entity: Entity): Observable<Entity>;
  update(entityId: string, entity: Entity): Observable<Entity>;
  delete(entityId: string): Observable<Entity>;
  findAll(): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
