import { Observable } from 'rxjs';
import { StockDomainModel } from '../models';

/**
 * Servicio de dominio de stock
 *
 * @export
 * @interface IStockDomainService
 * @template Entity
 */
export interface IStockDomainService<
  Entity extends StockDomainModel = StockDomainModel,
> {
  /**
   * Crear stock
   *
   * @param {Entity} entity Entidad de stock
   * @return  {Observable<Entity>} Observable de entidad de stock
   * @memberof IStockDomainService
   */
  createStock(entity: Entity): Observable<Entity>;
  /**
   * Actualizar stock
   *
   * @param {string} entityId Identificador de stock
   * @param {Entity} entity Entidad de stock
   * @return {Observable<Entity>} Observable de entidad de stock
   * @memberof IStockDomainService
   */
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  /**
   * Obtener stock por identificador de ubicación y producto
   *
   * @param {string} locationId Identificador de ubicación
   * @param {string} productId Identificador de producto
   * @return {Observable<Entity>} Observable de entidad de stock
   * @memberof IStockDomainService
   */
  findOneByLocationIdAndProductId(
    locationId: string,
    productId: string,
  ): Observable<Entity>;
  /**
   * Obtener stock por identificador
   *
   * @param {string} entityId Identificador de stock
   * @return {Observable<Entity>} Observable de entidad de stock
   * @memberof IStockDomainService
   */
  findOneById(entityId: string): Observable<Entity>;
}
