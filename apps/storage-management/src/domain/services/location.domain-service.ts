import { Observable } from 'rxjs';
import { LocationDomainModel } from '../models';

export interface ILocationDomainService<
  Entity extends LocationDomainModel = LocationDomainModel,
> {
  createLocation(entity: Entity): Observable<Entity>;
  updateLocation(entityId: string, entity: Entity): Observable<Entity>;
  getLocationById(entityId: string): Observable<Entity>;
  getAll(): Observable<Entity[]>;
}
