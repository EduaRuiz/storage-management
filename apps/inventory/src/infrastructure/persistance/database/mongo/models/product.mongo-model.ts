import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';
import { HydratedDocument, Document } from 'mongoose';

@Schema({ collection: 'product', versionKey: false })
export class ProductMongoModel extends Document implements ProductDomainModel {
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
