import { StockDomainModel } from '.';

/**
 * Modelo de dominio de movimiento de inventario
 *
 * @export
 * @class InventoryMovementDomainModel
 */
export class InventoryMovementDomainModel {
  /**
   * Identificador del movimiento de inventario
   *
   * @type {string}
   * @memberof InventoryMovementDomainModel
   */
  _id?: string;
  /**
   * Cantidad de productos
   *
   * @type {number}
   * @memberof InventoryMovementDomainModel
   */
  quantity: number;
  /**
   * Tipo de movimiento
   *
   * @type {('IN' | 'OUT')} IN: Entrada, OUT: Salida
   * @memberof InventoryMovementDomainModel
   */
  typeMovement: 'IN' | 'OUT';
  /**
   * Stock del producto
   *
   * @type {StockDomainModel}
   * @memberof InventoryMovementDomainModel
   */
  stock?: StockDomainModel;
  /**
   * Fecha y hora del movimiento
   *
   * @type {Date}
   * @memberof InventoryMovementDomainModel
   */
  dateTime: Date;

  /**
   * Crea una instancia de InventoryMovementDomainModel.
   *
   * @param {number} quantity Cantidad de productos
   * @param {('IN' | 'OUT')} typeMovement Tipo de movimiento IN: Entrada, OUT: Salida
   * @param {Date} dateTime Fecha y hora del movimiento
   * @param {string} [_id] Identificador del movimiento de inventario
   * @param {StockDomainModel} [stock] Stock del producto
   * @memberof InventoryMovementDomainModel
   */
  constructor(
    quantity: number,
    typeMovement: 'IN' | 'OUT',
    dateTime: Date,
    _id?: string,
    stock?: StockDomainModel,
  ) {
    this.quantity = quantity;
    this.typeMovement = typeMovement;
    this.dateTime = dateTime;
    _id && (this._id = _id);
    stock && (this.stock = stock);
  }
}
