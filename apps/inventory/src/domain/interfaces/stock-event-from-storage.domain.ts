import { ILocationFromStorageDomain } from '.';

export interface IStockEventFromStorageDomain {
  _id: string;
  quantity: number;
  productId: string;
  location: ILocationFromStorageDomain;
  dateTime: Date;
}
