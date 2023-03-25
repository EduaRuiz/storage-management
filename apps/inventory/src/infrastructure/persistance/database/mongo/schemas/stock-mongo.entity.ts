import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ProductMongoEntity } from '.';

@Entity('stock')
export class StockMongoEntity {
  @ObjectIdColumn()
  _id?: string;

  @Column()
  product: ProductMongoEntity;

  @Column()
  quantity: number;

  @Column()
  locationId: string;

  @Column()
  dateTime: Date | number;
}
