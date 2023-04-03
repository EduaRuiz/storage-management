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
   * Crea un stock
   *
   * @param {Entity} entity Stock
   * @return  {Observable<Entity>} Observable con el stock
   * @memberof IStockDomainService
   */
  createStock(entity: Entity): Observable<Entity>;
  /**
   * Actualiza un stock
   *
   * @param {string} entityId Identificador del stock
   * @param {Entity} entity Stock
   * @return {Observable<Entity>} Observable con el stock
   * @memberof IStockDomainService
   */
  updateQuantity(entityId: string, entity: Entity): Observable<Entity>;
  /**
   * Busca todos los stocks por identificador de producto
   *
   * @param {string} productId Identificador del producto
   * @return  {Observable<Entity[]>} Observable con los stocks
   * @memberof IStockDomainService
   */
  findAllByProductId(productId: string): Observable<Entity[]>;
  /**
   * Busca todos los stocks por identificador de ubicación
   *
   * @param {string} locationId Identificador de la ubicación
   * @return {Observable<Entity[]>} Observable con los stocks
   * @memberof IStockDomainService
   */
  findAllByLocationId(locationId: string): Observable<Entity[]>;
  /**
   * Busca un stock por identificador de producto y ubicación
   *
   * @param {string} productId Identificador del producto
   * @param {string} locationId Identificador de la ubicación
   * @return {Observable<Entity>} Observable con el stock
   * @memberof IStockDomainService
   */
  findByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Observable<Entity>;
  /**
   * Busca un stock por identificador
   *
   * @param {string} entityId Identificador del stock
   * @return {Observable<Entity>} Observable con el stock
   * @memberof IStockDomainService
   */
  findOneById(entityId: string): Observable<Entity>;
}
