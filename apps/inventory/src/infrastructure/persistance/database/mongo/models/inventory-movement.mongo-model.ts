import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InventoryMovementDomainModel } from 'apps/inventory/src/domain/models';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockMongoModel } from '.';

/**
 * Modelo de datos de movimiento de inventario para MongoDB
 *
 * @export
 * @class InventoryMovementMongoModel
 * @implements {InventoryMovementDomainModel}
 */
@Schema({ collection: 'inventory-movement', versionKey: false })
export class InventoryMovementMongoModel
  implements InventoryMovementDomainModel
{
  /**
   * Crea una instancia de InventoryMovementMongoModel
   *
   * @param {number} quantity Cantidad
   * @param {('IN' | 'OUT')} typeMovement Tipo de movimiento de inventario (IN: Entrada, OUT: Salida)
   * @param {Date} dateTime Fecha y hora del movimiento de inventario
   * @param {StockMongoModel} stock Stock
   * @param {string} [_id] Identificador único
   * @memberof InventoryMovementMongoModel
   */
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

  /**
   * Identificador único
   *
   * @type {string}
   * @memberof InventoryMovementMongoModel
   */
  _id?: string;

  /**
   * Cantidad
   *
   * @type {number}
   * @memberof InventoryMovementMongoModel
   */
  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  /**
   * Tipo de movimiento de inventario (IN: Entrada, OUT: Salida)
   *
   * @type {('IN' | 'OUT')}
   * @memberof InventoryMovementMongoModel
   */
  @Prop({
    required: true,
    type: String,
  })
  typeMovement: 'IN' | 'OUT';

  /**
   * Fecha y hora del movimiento de inventario
   *
   * @type {Date}
   * @memberof InventoryMovementMongoModel
   */
  @Prop({
    required: true,
    type: Date,
  })
  dateTime: Date;

  /**
   * Stock
   *
   * @type {StockMongoModel}
   * @memberof InventoryMovementMongoModel
   */
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
