import { IStockEventFromInventoryDomain } from '@storage/domain/interfaces';

/**
 * Mapa de eventos de inventario registrados
 *
 * @export
 * @interface IRegisteredInventoryMovementMap
 */
export interface IRegisteredInventoryMovementMap {
  /**
   * Evento de stock
   *
   * @type {IStockEventFromInventoryDomain} Evento de stock
   * @memberof IRegisteredInventoryMovementMap
   */
  stock: IStockEventFromInventoryDomain;
}
