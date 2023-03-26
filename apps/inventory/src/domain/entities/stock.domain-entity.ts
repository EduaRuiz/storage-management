import { ProductDomainEntity } from '.';

export class StockDomainEntity {
  _id?: string;
  quantity: number;
  dateTime: Date;
  locationId: string;
  product: ProductDomainEntity;
}
