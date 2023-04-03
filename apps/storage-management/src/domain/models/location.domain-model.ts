import { InventoryTransferDomainModel, StockDomainModel } from '.';

/**
 * Modelo de dominio de ubicación
 *
 * @export
 * @class LocationDomainModel
 */
export class LocationDomainModel {
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof LocationDomainModel
   */
  _id?: string;
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof LocationDomainModel
   */
  name: string;
  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof LocationDomainModel
   */
  description: string;
  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof LocationDomainModel
   */
  address: string;
  /**
   * Stock de la ubicación
   *
   * @type {StockDomainModel}
   * @memberof LocationDomainModel
   */
  stock?: StockDomainModel;
  /**
   * Movimientos de inventario de la ubicación
   *
   * @type {InventoryTransferDomainModel[]}
   * @memberof LocationDomainModel
   */
  inventoryMovements?: InventoryTransferDomainModel[];

  /**
   * Crea una instancia de LocationDomainModel.
   *
   * @param {string} name Nombre de la ubicación
   * @param {string} description Descripción de la ubicación
   * @param {string} address Dirección de la ubicación
   * @param {string} [_id] Identificador de la ubicación
   * @param {StockDomainModel} [stock] Stock de la ubicación
   * @param {InventoryTransferDomainModel[]} [inventoryMovements] Movimientos de inventario de la ubicación
   * @memberof LocationDomainModel
   */
  constructor(
    name: string,
    description: string,
    address: string,
    _id?: string,
    stock?: StockDomainModel,
    inventoryMovements?: InventoryTransferDomainModel[],
  ) {
    this.name = name;
    this.description = description;
    this.address = address;
    this._id = _id;
    this.stock = stock;
    this.inventoryMovements = inventoryMovements;
  }
}
