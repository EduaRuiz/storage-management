import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockDomainModel } from '../../../../../domain/models';
import { ProductMongoSchema } from '.';

@Schema({ collection: 'stock', versionKey: false })
export class StockMongoSchema implements StockDomainModel {
  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    required: true,
    type: String,
  })
  locationId: string;

  @Prop({
    required: true,
    type: Date,
  })
  dateTime: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductMongoSchema',
    required: true,
  })
  product: ProductMongoSchema;
}

export const StockSchema = SchemaFactory.createForClass(StockMongoSchema);
export type StockDocument = HydratedDocument<StockMongoSchema>;
