import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InventoryMovementDomainModel } from 'apps/inventory/src/domain/models';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { StockMongoModel } from '.';

@Schema({ collection: 'inventory-movement', versionKey: false })
export class InventoryMovementMongoModel
  extends Document
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
    ref: 'StockMongoModel',
    required: true,
  })
  stock: StockMongoModel;
}

export const InventoryMovementSchema = SchemaFactory.createForClass(
  InventoryMovementMongoModel,
);
export type InventoryMovementDocument =
  HydratedDocument<InventoryMovementMongoModel>;
