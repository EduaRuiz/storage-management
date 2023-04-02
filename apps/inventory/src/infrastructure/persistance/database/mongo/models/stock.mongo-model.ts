import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockDomainModel } from '../../../../../domain/models';
import { ProductMongoModel } from '.';

@Schema({ collection: 'stock', versionKey: false })
export class StockMongoModel implements StockDomainModel {
  constructor(
    quantity: number,
    locationId: string,
    dateTime: Date,
    product: ProductMongoModel,
    _id?: string,
  ) {
    this.quantity = quantity;
    this.locationId = locationId;
    this.dateTime = dateTime;
    this.product = product;
    this._id = _id;
  }

  _id?: string;

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
    ref: 'ProductMongoModel',
    required: true,
  })
  product: ProductMongoModel;
}

export const StockSchema = SchemaFactory.createForClass(StockMongoModel);
export type StockDocument = HydratedDocument<StockMongoModel>;
