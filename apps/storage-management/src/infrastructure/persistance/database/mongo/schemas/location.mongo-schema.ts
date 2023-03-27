import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ collection: 'product', versionKey: false })
export class LocationMongoSchema implements LocationDomainModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationMongoSchema',
    unique: true,
  })
  _id?: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  description: string;

  @Prop({
    required: true,
    type: Object,
  })
  location: { log: number; lat: number };
}

export const LocationSchema = SchemaFactory.createForClass(LocationMongoSchema);
export type LocationDocument = HydratedDocument<LocationMongoSchema>;
