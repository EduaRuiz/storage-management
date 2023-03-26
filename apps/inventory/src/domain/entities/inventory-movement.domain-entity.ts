import { StockDomainEntity } from '.';

export class InventoryMovementDomainEntity {
  _id?: string;
  quantity: number;
  dateTime: Date;
  typeMovement: 'IN' | 'OUT';
  stock: StockDomainEntity;
}
