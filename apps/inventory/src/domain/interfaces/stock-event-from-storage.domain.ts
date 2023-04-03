import { ILocationFromStorageDomain } from '.';

/**
 * @description Interfaz que representa la respuesta de la consulta de existencia de un producto
 *
 * @export
 * @interface IStockEventFromStorageDomain
 */
export interface IStockEventFromStorageDomain {
  /**
   * Identificador del evento de stock
   *
   * @type {string}
   * @memberof IStockEventFromStorageDomain
   */
  _id: string;
  /**
   * Cantidad de productos
   *
   * @type {number}
   * @memberof IStockEventFromStorageDomain
   */
  quantity: number;
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof IStockEventFromStorageDomain
   */
  productId: string;
  /**
   * Identificador de la ubicación
   *
   * @type {ILocationFromStorageDomain}
   * @memberof IStockEventFromStorageDomain
   */
  location: ILocationFromStorageDomain;
  /**
   * Fecha y hora del evento
   *
   * @type {Date}
   * @memberof IStockEventFromStorageDomain
   */
  dateTime: Date;
}
