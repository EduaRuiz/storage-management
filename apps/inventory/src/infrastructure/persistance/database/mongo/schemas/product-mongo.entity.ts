import { Entity, ObjectIdColumn, Column, Generated } from 'typeorm';

@Entity('product')
export class ProductMongoEntity {
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
