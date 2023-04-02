import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InventoryMovementDomainModel } from 'apps/inventory/src/domain/models';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockMongoModel } from '.';

@Schema({ collection: 'inventory-movement', versionKey: false })
export class InventoryMovementMongoModel
  implements InventoryMovementDomainModel
{
  constructor(
    quantity: number,
    typeMovement: 'IN' | 'OUT',
    dateTime: Date,
    stock: StockMongoModel,
    _id?: string,
  ) {
    this.quantity = quantity;
    this.typeMovement = typeMovement;
    this.dateTime = dateTime;
    this.stock = stock;
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
