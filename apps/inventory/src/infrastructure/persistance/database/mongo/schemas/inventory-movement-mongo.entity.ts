import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { StockMongoEntity } from '.';

@Entity('inventory-movement')
export class InventoryMovementMongoEntity {
  @ObjectIdColumn()
  _id?: string;

  @Column()
  stock: StockMongoEntity;

  @Column()
  quantity: number;

  @Column()
  typeMovement: 'IN' | 'OUT';

  @Column()
  dateTime: Date | number;
}
