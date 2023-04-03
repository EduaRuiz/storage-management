import { Observable } from 'rxjs';
import { LocationDomainModel } from '../models';

/**
 * Servicio de dominio de ubicación
 *
 * @export
 * @interface ILocationDomainService
 * @template Entity
 */
export interface ILocationDomainService<
  Entity extends LocationDomainModel = LocationDomainModel,
> {
  /**
   * Crear ubicación
   *
   * @param {Entity} entity Entidad de ubicación
   * @return  {Observable<Entity>} Observable de entidad de ubicación
   * @memberof ILocationDomainService
   */
  createLocation(entity: Entity): Observable<Entity>;
  /**
   * Actualizar ubicación
   *
   * @param {string} entityId Identificador de ubicación
   * @param {Entity} entity Entidad de ubicación
   * @return  {Observable<Entity>} Observable de entidad de ubicación
   * @memberof ILocationDomainService
   */
  updateLocation(entityId: string, entity: Entity): Observable<Entity>;
  /**
   * Obtener ubicación por identificador
   *
   * @param {string} entityId Identificador de ubicación
   * @return {Observable<Entity>} Observable de entidad de ubicación
   * @memberof ILocationDomainService
   */
  getLocationById(entityId: string): Observable<Entity>;
  /**
   * Obtener todas las ubicaciones
   *
   * @return {Observable<Entity[]>} Observable de entidades de ubicación
   * @memberof ILocationDomainService
   */
  getAll(): Observable<Entity[]>;
}
