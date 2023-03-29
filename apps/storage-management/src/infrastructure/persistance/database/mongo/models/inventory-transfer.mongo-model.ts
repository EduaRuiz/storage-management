import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { StockMongoModel } from '.';
import { InventoryTransferDomainModel } from 'apps/storage-management/src/domain/models';

@Schema({ collection: 'inventory-transfer', versionKey: false })
export class InventoryTransferMongoModel
  extends Document
  implements InventoryTransferDomainModel
{
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
