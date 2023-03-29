import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      // uri: 'mongodb://root:password@localhost:27017',
      uri: 'mongodb://localhost:27017',
      // authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  }
}
