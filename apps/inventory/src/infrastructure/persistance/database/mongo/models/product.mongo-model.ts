import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'product', versionKey: false })
export class ProductMongoModel implements ProductDomainModel {
  constructor(name: string, description: string, price: number, _id?: string) {
    this.name = name;
    this.description = description;
    this.price = price;
    this._id = _id;
  }

  _id?: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  description: string;

  @Prop({
    required: true,
    type: Number,
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductMongoModel);
export type ProductDocument = HydratedDocument<ProductMongoModel>;
