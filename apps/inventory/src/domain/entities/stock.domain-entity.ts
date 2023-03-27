import { ProductDomainEntity } from '.';

export class StockDomainEntity {
  _id?: string;
  quantity: number;
  locationId: string;
  product?: ProductDomainEntity;
  dateTime: Date | number;
}
