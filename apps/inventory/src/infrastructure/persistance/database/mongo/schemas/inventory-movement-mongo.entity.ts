import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { StockMongoEntity } from '.';
import { InventoryMovementDomainEntity } from 'apps/inventory/src/domain/entities';

@Entity('inventory-movement')
export class InventoryMovementMongoEntity
  implements InventoryMovementDomainEntity
{
  @ObjectIdColumn()
  _id?: string;

  @Column()
  stock: StockMongoEntity;

  @Column()
  stockId: string;

  @Column()
  quantity: number;

  @Column()
  typeMovement: 'IN' | 'OUT';

  @Column()
  dateTime: Date | number;
}
