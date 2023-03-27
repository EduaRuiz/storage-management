import { InventoryMovementDomainModel, StockDomainModel } from '.';

export class ProductDomainModel {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock?: StockDomainModel;
  inventoryMovements?: InventoryMovementDomainModel[];

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
