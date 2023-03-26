import { InventoryMovementDomainEntity, StockDomainEntity } from '.';

export class ProductDomainEntity {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock?: StockDomainEntity;
  inventoryMovements?: InventoryMovementDomainEntity[];
}
