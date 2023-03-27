import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ProductMongoEntity } from '.';
import { StockDomainEntity } from 'apps/inventory/src/domain/entities';

@Entity('stock')
export class StockMongoEntity implements StockDomainEntity {
  @ObjectIdColumn()
  _id?: string;

  @Column((type) => ProductMongoEntity)
  product: ProductMongoEntity;

  @Column()
  quantity: number;

  @Column()
  locationId: string;

  @Column()
  dateTime: Date | number;
}
