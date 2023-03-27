import { ProductDomainModel } from '.';

export class StockDomainModel {
  _id?: string;
  quantity: number;
  locationId: string;
  product?: ProductDomainModel;
  dateTime: Date;

  constructor(
    quantity: number,
    locationId: string,
    dateTime: Date,
    _id?: string,
    product?: ProductDomainModel,
  ) {
    this.quantity = quantity;
    this.locationId = locationId;
    this._id = _id;
    this.product = product;
    this.dateTime = dateTime;
  }
}
