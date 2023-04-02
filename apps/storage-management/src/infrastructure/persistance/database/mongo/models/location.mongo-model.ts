import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'location', versionKey: false })
export class LocationMongoModel implements LocationDomainModel {
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

  _id?: string;

  @Prop({
    name: 'name',
    required: true,
    unique: true,
    type: String,
  })
  name: string;

  @Prop({
    name: 'description',
    required: true,
    type: String,
  })
  description: string;

  @Prop({
    name: 'address',
    required: true,
    type: Object,
  })
  address: string;
}

export const LocationSchema = SchemaFactory.createForClass(LocationMongoModel);
export type LocationDocument = HydratedDocument<LocationMongoModel>;
