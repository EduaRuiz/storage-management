import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { StockMongoSchema } from './stock.mongo-schema';
import { InventoryTransferDomainModel } from 'apps/storage-management/src/domain/models';

@Schema({ collection: 'inventory-transfer', versionKey: false })
export class InventoryTransferMongoSchema
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
    ref: 'StockMongoSchema',
    required: true,
  })
  stockIn: StockMongoSchema;

  @Prop({
    name: 'stock-out',
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
