import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ collection: 'location', versionKey: false })
export class LocationMongoModel
  extends mongoose.Document
  implements LocationDomainModel
{
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
