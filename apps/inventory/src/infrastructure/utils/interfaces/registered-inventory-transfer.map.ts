import { IStockEventFromStorageDomain } from '@inventory/domain/interfaces';

/**
 * Mapa de eventos de inventario registrados
 *
 * @export
 * @interface IRegisteredInventoryTransferMap
 */
export interface IRegisteredInventoryTransferMap {
  /**
   * Evento de salida de inventario
   *
   * @type {IStockEventFromStorageDomain}
   * @memberof IRegisteredInventoryTransferMap
   */
  stockOut: IStockEventFromStorageDomain;
  /**
   * Evento de entrada de inventario
   *
   * @type {IStockEventFromStorageDomain}
   * @memberof IRegisteredInventoryTransferMap
   */
  stockIn: IStockEventFromStorageDomain;
}
