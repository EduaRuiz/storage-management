import { InventoryTransferDomainModel, StockDomainModel } from '.';

export class LocationDomainModel {
  _id?: string;
  name: string;
  description: string;
  address: string;
  stock?: StockDomainModel;
  inventoryMovements?: InventoryTransferDomainModel[];

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
