import { StockDomainModel } from '.';

export class InventoryTransferDomainModel {
  _id?: string;
  quantity: number;
  stockIn: StockDomainModel;
  stockOut: StockDomainModel;
  dateTime: Date;

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
