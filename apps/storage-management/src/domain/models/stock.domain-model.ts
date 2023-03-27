import { LocationDomainModel } from '.';

export class StockDomainModel {
  _id?: string;
  quantity: number;
  location?: LocationDomainModel;
  productId: string;
  dateTime: Date;

  constructor(
    quantity: number,
    productId: string,
    dateTime: Date,
    _id?: string,
    location?: LocationDomainModel,
  ) {
    this.quantity = quantity;
    this.productId = productId;
    this.dateTime = dateTime;
    this._id = _id;
    this.location = location;
  }
}
