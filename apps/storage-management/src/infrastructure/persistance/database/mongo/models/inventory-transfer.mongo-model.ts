import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockMongoModel } from '.';
import { InventoryTransferDomainModel } from 'apps/storage-management/src/domain/models';

/**
 * Modelo de transferencia de inventario en MongoDB
 *
 * @export
 * @class InventoryTransferMongoModel
 * @implements {InventoryTransferDomainModel}
 */
@Schema({ collection: 'inventory-transfer', versionKey: false })
export class InventoryTransferMongoModel
  implements InventoryTransferDomainModel
{
  /**
   * Crea una instancia de InventoryTransferMongoModel
   *
   * @param {StockMongoModel} stockIn Stock de entrada
   * @param {StockMongoModel} stockOut Stock de salida
   * @param {number} quantity Cantidad de transferencia
   * @param {string} [_id] Identificador de la transferencia de inventario
   * @memberof InventoryTransferMongoModel
   */
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

  /**
   * Identificador de la transferencia de inventario
   *
   * @type {string}
   * @memberof InventoryTransferMongoModel
   */
  _id?: string;

  /**
   * Cantidad de transferencia
   *
   * @type {number}
   * @memberof InventoryTransferMongoModel
   */
  @Prop({
    name: 'quantity',
    required: true,
    type: Number,
  })
  quantity: number;

  /**
   * Fecha y hora de la transferencia
   *
   * @type {Date}
   * @memberof InventoryTransferMongoModel
   */
  @Prop({
    name: 'date-time',
    required: true,
    type: Date,
    default: Date.now(),
  })
  dateTime: Date;

  /**
   * Stock de entrada
   *
   * @type {StockMongoModel}
   * @memberof InventoryTransferMongoModel
   */
  @Prop({
    name: 'stock-in',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockMongoModel',
    required: true,
  })
  stockIn: StockMongoModel;

  /**
   * Stock de salida
   *
   * @type {StockMongoModel}
   * @memberof InventoryTransferMongoModel
   */
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
