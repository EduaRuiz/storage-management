import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockDomainModel } from '../../../../../domain/models';
import { ProductMongoModel } from '.';

/**
 * Modelo de datos de stock para MongoDB
 *
 * @export
 * @class StockMongoModel
 * @implements {StockDomainModel}
 */
@Schema({ collection: 'stock', versionKey: false })
export class StockMongoModel implements StockDomainModel {
  /**
   * Crea una instancia de StockMongoModel
   *
   * @param {number} quantity Cantidad
   * @param {string} locationId Identificador de ubicación
   * @param {Date} dateTime Fecha y hora del stock
   * @param {ProductMongoModel} product Producto
   * @param {string} [_id] Identificador único
   * @memberof StockMongoModel
   */
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

  /**
   * Identificador único
   *
   * @type {string}
   * @memberof StockMongoModel
   */
  _id?: string;

  /**
   * Cantidad
   *
   * @type {number}
   * @memberof StockMongoModel
   */
  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  /**
   * Identificador de ubicación
   *
   * @type {string}
   * @memberof StockMongoModel
   */
  @Prop({
    required: true,
    type: String,
  })
  locationId: string;

  /**
   * Fecha y hora del stock
   *
   * @type {Date}
   * @memberof StockMongoModel
   */
  @Prop({
    required: true,
    type: Date,
  })
  dateTime: Date;

  /**
   * Producto
   *
   * @type {ProductMongoModel}
   * @memberof StockMongoModel
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductMongoModel',
    required: true,
  })
  product: ProductMongoModel;
}

export const StockSchema = SchemaFactory.createForClass(StockMongoModel);
export type StockDocument = HydratedDocument<StockMongoModel>;
