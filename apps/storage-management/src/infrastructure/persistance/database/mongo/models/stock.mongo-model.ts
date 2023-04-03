import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StockDomainModel } from '../../../../../domain/models';
import { LocationMongoModel } from '.';

/**
 * Modelo de stock en MongoDB
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
   * @param {LocationMongoModel} location Ubicación del stock
   * @param {number} quantity Cantidad de stock
   * @param {string} productId Identificador del producto
   * @param {string} [_id] Identificador del stock
   * @memberof StockMongoModel
   */
  constructor(
    location: LocationMongoModel,
    quantity: number,
    productId: string,
    _id?: string,
  ) {
    this.location = location;
    this.quantity = quantity;
    this.productId = productId;
    this._id = _id;
  }

  /**
   * Identificador del stock
   *
   * @type {string}
   * @memberof StockMongoModel
   */
  _id?: string;

  /**
   * Cantidad de stock
   *
   * @type {number}
   * @memberof StockMongoModel
   */
  @Prop({
    name: 'quantity',
    required: true,
    type: Number,
  })
  quantity: number;

  /**
   * Ubicación del stock
   *
   * @type {LocationMongoModel}
   * @memberof StockMongoModel
   */
  @Prop({
    name: 'location',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationMongoModel',
    required: true,
  })
  location: LocationMongoModel;

  /**
   * Fecha de creación del stock
   *
   * @type {Date}
   * @memberof StockMongoModel
   */
  @Prop({
    name: 'date-time',
    required: true,
    type: Date,
    default: Date.now(),
  })
  dateTime: Date;

  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof StockMongoModel
   */
  @Prop({
    name: 'product-id',
    required: true,
    type: String,
  })
  productId: string;
}

export const StockSchema = SchemaFactory.createForClass(StockMongoModel);
export type StockDocument = HydratedDocument<StockMongoModel>;
