import { ProductDomainModel } from '.';

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
   * Cantidad de productos
   *
   * @type {number}
   * @memberof StockDomainModel
   */
  quantity: number;
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof StockDomainModel
   */
  locationId: string;
  /**
   * Producto
   *
   * @type {ProductDomainModel}
   * @memberof StockDomainModel
   */
  product?: ProductDomainModel;
  /**
   * Fecha y hora del evento
   *
   * @type {Date}
   * @memberof StockDomainModel
   */
  dateTime: Date;

  /**
   * Crea una instancia de StockDomainModel.
   *
   * @param {number} quantity Cantidad de productos
   * @param {string} locationId Identificador de la ubicación
   * @param {Date} dateTime Fecha y hora del evento
   * @param {string} [_id] Identificador del stock
   * @param {ProductDomainModel} [product] Producto
   * @memberof StockDomainModel
   */
  constructor(
    quantity: number,
    locationId: string,
    dateTime: Date,
    _id?: string,
    product?: ProductDomainModel,
  ) {
    this.quantity = quantity;
    this.locationId = locationId;
    this._id = _id;
    this.product = product;
    this.dateTime = dateTime;
  }
}
