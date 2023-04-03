import { Observable } from 'rxjs';
import { InventoryMovementDomainModel } from '../models';

/**
 * Servicio de dominio de movimientos de inventario
 *
 * @export
 * @interface IInventoryMovementDomainService
 * @template Entity
 */
export interface IInventoryMovementDomainService<
  Entity extends InventoryMovementDomainModel = InventoryMovementDomainModel,
> {
  /**
   * Crea un movimiento de inventario
   *
   * @param {Entity} entity Movimiento de inventario
   * @return   {Observable<Entity>} Observable con el movimiento de inventario
   * @memberof IInventoryMovementDomainService
   */
  create(entity: Entity): Observable<Entity>;
  /**
   * Busca todos los movimientos de inventario por identificador de stock
   *
   * @param {string} stockId Identificador del movimiento de inventario
   * @return  {Observable<Entity[]>} Observable con los movimientos de inventario
   * @memberof IInventoryMovementDomainService
   */
  findAllByStockId(stockId: string): Observable<Entity[]>;
  /**
   * Busca todos los movimientos de inventario por identificador de producto
   *
   * @param {string} productId Identificador del producto
   * @return  {Observable<Entity[]>} Observable con los movimientos de inventario
   * @memberof IInventoryMovementDomainService
   */
  findAllByProductId(productId: string): Observable<Entity[]>;
  /**
   * Busca un movimiento de inventario por identificador
   *
   * @param {string} entityId Identificador del movimiento de inventario
   * @return  {Observable<Entity>} Observable con el movimiento de inventario
   * @memberof IInventoryMovementDomainService
   */
  findOneById(entityId: string): Observable<Entity>;
}
