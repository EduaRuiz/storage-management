import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockDomainModel } from '../../../../../domain/models';
import { LocationMongoSchema } from '.';

@Schema({ collection: 'stock', versionKey: false })
export class StockMongoSchema implements StockDomainModel {
  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationMongoSchema',
    required: true,
  })
  location: LocationMongoSchema;

  @Prop({
    required: true,
    type: Date,
  })
  dateTime: Date;

  @Prop({
    required: true,
    type: String,
  })
  productId: string;
}

export const StockSchema = SchemaFactory.createForClass(StockMongoSchema);
export type StockDocument = HydratedDocument<StockMongoSchema>;
