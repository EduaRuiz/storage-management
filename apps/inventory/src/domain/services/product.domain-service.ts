import { Observable } from 'rxjs';
import { ProductDomainModel } from '../models';

export interface IProductDomainService<
  Entity extends ProductDomainModel = ProductDomainModel,
> {
  create(entity: Entity): Observable<Entity>;
  update(entityId: string, entity: Entity): Observable<Entity>;
  delete(entityId: string): Observable<Entity>;
  findAll(): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
