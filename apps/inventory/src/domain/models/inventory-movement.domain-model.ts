import { StockDomainModel } from '.';

export class InventoryMovementDomainModel {
  _id?: string;
  quantity: number;
  typeMovement: 'IN' | 'OUT';
  stock?: StockDomainModel;
  dateTime: Date;

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
