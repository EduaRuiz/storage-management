import { IProductFromInventoryDomain } from '.';

export interface IStockEventFromInventoryDomain {
  _id: string;
  quantity: number;
  locationId: string;
  product: IProductFromInventoryDomain;
  dateTime: Date;
}
