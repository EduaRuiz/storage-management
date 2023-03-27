import { InventoryTransferDomainModel, StockDomainModel } from '.';

export class LocationDomainModel {
  _id?: string;
  name: string;
  description: string;
  location: { log: number; lat: number };
  stock?: StockDomainModel;
  inventoryMovements?: InventoryTransferDomainModel[];

  constructor(
    name: string,
    description: string,
    location: { log: number; lat: number },
    _id?: string,
    stock?: StockDomainModel,
    inventoryMovements?: InventoryTransferDomainModel[],
  ) {
    this.name = name;
    this.description = description;
    this.location = location;
    this._id = _id;
    this.stock = stock;
    this.inventoryMovements = inventoryMovements;
  }
}
