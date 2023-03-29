import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockDomainModel } from '../../../../../domain/models';
import { LocationMongoModel } from '.';

@Schema({ collection: 'stock', versionKey: false })
export class StockMongoModel
  extends mongoose.Document
  implements StockDomainModel
{
  @Prop({
    name: 'quantity',
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    name: 'location',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationMongoModel',
    required: true,
  })
  location: LocationMongoModel;

  @Prop({
    name: 'date-time',
    required: true,
    type: Date,
    default: Date.now(),
  })
  dateTime: Date;

  @Prop({
    name: 'product-id',
    required: true,
    type: String,
  })
  productId: string;
}

export const StockSchema = SchemaFactory.createForClass(StockMongoModel);
export type StockDocument = HydratedDocument<StockMongoModel>;