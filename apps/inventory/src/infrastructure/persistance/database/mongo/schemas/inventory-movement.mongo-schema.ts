import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InventoryMovementDomainModel } from 'apps/inventory/src/domain/models';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockMongoSchema } from './stock.mongo-schema';

@Schema({ collection: 'inventory-movement', versionKey: false })
export class InventoryMovementMongoSchema
  implements InventoryMovementDomainModel
{
  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    required: true,
    type: String,
  })
  typeMovement: 'IN' | 'OUT';

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
  stock: StockMongoSchema;
}

export const InventoryMovementSchema = SchemaFactory.createForClass(
  InventoryMovementMongoSchema,
);
export type InventoryMovementDocument =
  HydratedDocument<InventoryMovementMongoSchema>;
