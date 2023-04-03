import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';
import { HydratedDocument } from 'mongoose';

/**
 * Modelo de datos de producto para MongoDB
 *
 * @export
 * @class ProductMongoModel
 * @implements {ProductDomainModel}
 */
@Schema({ collection: 'product', versionKey: false })
export class ProductMongoModel implements ProductDomainModel {
  /**
   * Crea una instancia de ProductMongoModel
   *
   * @param {string} name Nombre
   * @param {string} description Descripción
   * @param {number} price Precio
   * @param {string} [_id] Identificador único
   * @memberof ProductMongoModel
   */
  constructor(name: string, description: string, price: number, _id?: string) {
    this.name = name;
    this.description = description;
    this.price = price;
    this._id = _id;
  }

  /**
   * Identificador único
   *
   * @type {string}
   * @memberof ProductMongoModel
   */
  _id?: string;

  /**
   * Nombre
   *
   * @type {string}
   * @memberof ProductMongoModel
   */
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  name: string;

  /**
   * Descripción
   *
   * @type {string}
   * @memberof ProductMongoModel
   */
  @Prop({
    required: true,
    type: String,
  })
  description: string;

  /**
   * Precio
   *
   * @type {number}
   * @memberof ProductMongoModel
   */
  @Prop({
    required: true,
    type: Number,
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductMongoModel);
export type ProductDocument = HydratedDocument<ProductMongoModel>;
