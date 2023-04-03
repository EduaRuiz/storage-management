import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';
import { HydratedDocument } from 'mongoose';

/**
 * Modelo de ubicación en MongoDB
 *
 * @export
 * @class LocationMongoModel
 * @implements {LocationDomainModel}
 */
@Schema({ collection: 'location', versionKey: false })
export class LocationMongoModel implements LocationDomainModel {
  /**
   * Crea una instancia de LocationMongoModel
   *
   * @param {string} name Nombre de la ubicación
   * @param {string} description Descripción de la ubicación
   * @param {string} address Dirección de la ubicación
   * @param {string} [_id] Identificador de la ubicación
   * @memberof LocationMongoModel
   */
  constructor(
    name: string,
    description: string,
    address: string,
    _id?: string,
  ) {
    this.name = name;
    this.description = description;
    this.address = address;
    this._id = _id;
  }

  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof LocationMongoModel
   */
  _id?: string;

  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof LocationMongoModel
   */
  @Prop({
    name: 'name',
    required: true,
    unique: true,
    type: String,
  })
  name: string;

  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof LocationMongoModel
   */
  @Prop({
    name: 'description',
    required: true,
    type: String,
  })
  description: string;

  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof LocationMongoModel
   */
  @Prop({
    name: 'address',
    required: true,
    type: Object,
  })
  address: string;
}

export const LocationSchema = SchemaFactory.createForClass(LocationMongoModel);
export type LocationDocument = HydratedDocument<LocationMongoModel>;
