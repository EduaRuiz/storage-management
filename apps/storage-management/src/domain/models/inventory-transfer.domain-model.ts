import { StockDomainModel } from '.';

/**
 * Modelo de dominio de transferencia de inventario
 *
 * @export
 * @class InventoryTransferDomainModel
 */
export class InventoryTransferDomainModel {
  /**
   * Identificador de la transferencia de inventario
   *
   * @type {string}
   * @memberof InventoryTransferDomainModel
   */
  _id?: string;
  /**
   * Cantidad de transferencia
   *
   * @type {number}
   * @memberof InventoryTransferDomainModel
   */
  quantity: number;
  /**
   * Stock de entrada
   *
   * @type {StockDomainModel}
   * @memberof InventoryTransferDomainModel
   */
  stockIn: StockDomainModel;
  /**
   * Stock de salida
   *
   * @type {StockDomainModel}
   * @memberof InventoryTransferDomainModel
   */
  stockOut: StockDomainModel;
  /**
   * Fecha y hora de la transferencia
   *
   * @type {Date}
   * @memberof InventoryTransferDomainModel
   */
  dateTime: Date;

  /**
   * Crea una instancia de InventoryTransferDomainModel.
   *
   * @param {number} quantity Cantidad de transferencia
   * @param {Date} dateTime Fecha y hora de la transferencia
   * @param {StockDomainModel} stockIn Stock de entrada
   * @param {StockDomainModel} stockOut Stock de salida
   * @param {string} [_id] Identificador de la transferencia de inventario
   * @memberof InventoryTransferDomainModel
   */
  constructor(
    quantity: number,
    dateTime: Date,
    stockIn: StockDomainModel,
    stockOut: StockDomainModel,
    _id?: string,
  ) {
    this.quantity = quantity;
    this.stockIn = stockIn;
    this.stockOut = stockOut;
    this.dateTime = dateTime;
    this._id = _id;
  }
}
