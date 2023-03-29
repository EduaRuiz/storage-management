import { StockDomainEntity } from '.';

export class InventoryMovementDomainEntity {
  _id?: string;
  quantity: number;
  typeMovement: 'IN' | 'OUT';
  stock?: StockDomainEntity;
  dateTime: Date | number;

  constructor(
    quantity: number,
    typeMovement: 'IN' | 'OUT',
    dateTime: Date | number,
    _id?: string,
    stock?: StockDomainEntity,
  ) {
    this.quantity = quantity;
    this.typeMovement = typeMovement;
    this.dateTime = dateTime;
    _id && (this._id = _id);
    stock && (this.stock = stock);
  }
}
