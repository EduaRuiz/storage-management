import { IProductFromInventoryDomain } from '.';

/**
 * Interfaz que representa la estructura de un evento de stock existente
 *
 * @export
 * @interface IStockEventFromInventoryDomain
 */
export interface IStockEventFromInventoryDomain {
  /**
   * Identificador del evento de stock
   *
   * @type {string}
   * @memberof IStockEventFromInventoryDomain
   */
  _id: string;
  /**
   * Cantidad de stock de producto
   *
   * @type {number}
   * @memberof IStockEventFromInventoryDomain
   */
  quantity: number;
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof IStockEventFromInventoryDomain
   */
  locationId: string;
  /**
   * Producto del evento de stock
   *
   * @type {IProductFromInventoryDomain}
   * @memberof IStockEventFromInventoryDomain
   */
  product: IProductFromInventoryDomain;
  /**
   * Fecha y hora del evento de stock
   *
   * @type {Date}
   * @memberof IStockEventFromInventoryDomain
   */
  dateTime: Date;
}
