import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockMongoSchema } from './stock.mongo-schema';
import { InventoryTransferDomainModel } from 'apps/storage-management/src/domain/models';

@Schema({ collection: 'inventory-movement', versionKey: false })
export class InventoryTransferMongoSchema
  implements InventoryTransferDomainModel
{
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryTransferMongoSchema',
    unique: true,
  })
  _id?: string;

  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    required: true,
    type: Date,
  })
  dateTime: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockMongoSchema',
    required: true,
  })
  stockIn: StockMongoSchema;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockMongoSchema',
    required: true,
  })
  stockOut: StockMongoSchema;
}

export const InventoryTransferSchema = SchemaFactory.createForClass(
  InventoryTransferMongoSchema,
);
export type InventoryTransferDocument =
  HydratedDocument<InventoryTransferMongoSchema>;
