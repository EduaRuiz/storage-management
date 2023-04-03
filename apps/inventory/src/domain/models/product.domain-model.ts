import { InventoryMovementDomainModel, StockDomainModel } from '.';

/**
 * Modelo de dominio de producto
 *
 * @export
 * @class ProductDomainModel
 */
export class ProductDomainModel {
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof ProductDomainModel
   */
  _id?: string;
  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof ProductDomainModel
   */
  name: string;
  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof ProductDomainModel
   */
  description: string;
  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof ProductDomainModel
   */
  price: number;
  /**
   * Stock del producto
   *
   * @type {StockDomainModel}
   * @memberof ProductDomainModel
   */
  stock?: StockDomainModel;
  /**
   * Movimientos de inventario del producto
   *
   * @type {InventoryMovementDomainModel[]}
   * @memberof ProductDomainModel
   */
  inventoryMovements?: InventoryMovementDomainModel[];

  /**
   * Crea una instancia de ProductDomainModel.
   *
   * @param {string} name Nombre del producto
   * @param {string} description Descripción del producto
   * @param {number} price Precio del producto
   * @param {string} [_id] Identificador del producto
   * @param {StockDomainModel} [stock] Stock del producto
   * @param {InventoryMovementDomainModel[]} [inventoryMovements] Movimientos de inventario del producto
   * @memberof ProductDomainModel
   */
  constructor(
    name: string,
    description: string,
    price: number,
    _id?: string,
    stock?: StockDomainModel,
    inventoryMovements?: InventoryMovementDomainModel[],
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this._id = _id;
    this.stock = stock;
    this.inventoryMovements = inventoryMovements;
  }
}
