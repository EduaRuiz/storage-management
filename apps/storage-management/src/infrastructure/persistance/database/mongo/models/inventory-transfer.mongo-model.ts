import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockMongoModel } from '.';
import { InventoryTransferDomainModel } from 'apps/storage-management/src/domain/models';

@Schema({ collection: 'inventory-transfer', versionKey: false })
export class InventoryTransferMongoModel
  implements InventoryTransferDomainModel
{
  constructor(
    stockIn: StockMongoModel,
    stockOut: StockMongoModel,
    quantity: number,
    _id?: string,
  ) {
    this.stockIn = stockIn;
    this.stockOut = stockOut;
    this.quantity = quantity;
    this._id = _id;
  }

  _id?: string;

  @Prop({
    name: 'quantity',
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    name: 'date-time',
    required: true,
    type: Date,
    default: Date.now(),
  })
  dateTime: Date;

  @Prop({
    name: 'stock-in',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockMongoModel',
    required: true,
  })
  stockIn: StockMongoModel;

  @Prop({
    name: 'stock-out',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockMongoModel',
    required: true,
  })
  stockOut: StockMongoModel;
}

export const InventoryTransferSchema = SchemaFactory.createForClass(
  InventoryTransferMongoModel,
);
export type InventoryTransferDocument =
  HydratedDocument<InventoryTransferMongoModel>;
