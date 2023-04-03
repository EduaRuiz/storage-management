import { LocationDomainModel } from '.';

/**
 * Modelo de dominio de stock
 *
 * @export
 * @class StockDomainModel
 */
export class StockDomainModel {
  /**
   * Identificador del stock
   *
   * @type {string}
   * @memberof StockDomainModel
   */
  _id?: string;
  /**
   * Cantidad de stock
   *
   * @type {number}
   * @memberof StockDomainModel
   */
  quantity: number;
  /**
   * Ubicación del stock
   *
   * @type {LocationDomainModel}
   * @memberof StockDomainModel
   */
  location?: LocationDomainModel;
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof StockDomainModel
   */
  productId: string;
  /**
   * Fecha y hora del evento de stock
   *
   * @type {Date}
   * @memberof StockDomainModel
   */
  dateTime: Date;

  /**
   * Crea una instancia de StockDomainModel.
   *
   * @param {number} quantity Cantidad de stock
   * @param {string} productId Identificador del producto
   * @param {Date} dateTime Fecha y hora del evento de stock
   * @param {string} [_id] Identificador del stock
   * @param {LocationDomainModel} [location] Ubicación del stock
   * @memberof StockDomainModel
   */
  constructor(
    quantity: number,
    productId: string,
    dateTime: Date,
    _id?: string,
    location?: LocationDomainModel,
  ) {
    this.quantity = quantity;
    this.productId = productId;
    this.dateTime = dateTime;
    this._id = _id;
    this.location = location;
  }
}
