import { Observable } from 'rxjs';
import { InventoryTransferDomainModel } from '../models';

/**
 * Servicio de dominio de transferencia de inventario
 *
 * @export
 * @interface IInventoryTransferDomainService
 * @template Entity
 */
export interface IInventoryTransferDomainService<
  Entity extends InventoryTransferDomainModel = InventoryTransferDomainModel,
> {
  /**
   * Generar transferencia de inventario
   *
   * @param {Entity} entity Entidad de transferencia de inventario
   * @return {Observable<Entity>} Observable de entidad de transferencia de inventario
   * @memberof IInventoryTransferDomainService
   */
  generateTransfer(entity: Entity): Observable<Entity>;
  /**
   * Obtener transferencias por identificador de producto
   *
   * @param {string} productId Identificador de producto
   * @return {Observable<Entity[]>} Observable de entidades de transferencia de inventario
   * @memberof IInventoryTransferDomainService
   */
  getTransfersByProductId(productId: string): Observable<Entity[]>;
  /**
   * Obtener transferencias por identificador de ubicación
   *
   * @param {string} locationId Identificador de ubicación
   * @return {Observable<Entity[]>} Observable de entidades de transferencia de inventario
   * @memberof IInventoryTransferDomainService
   */
  getTransfersByLocationId(locationId: string): Observable<Entity[]>;
}
