import { ProductDomainEntity } from 'apps/inventory/src/domain/entities';
import { Entity, ObjectIdColumn, Column, Generated } from 'typeorm';

@Entity('product')
export class ProductMongoEntity implements ProductDomainEntity {
  @ObjectIdColumn()
  @Generated('uuid')
  _id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;
}
