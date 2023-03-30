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
    console.log(this.configService.get<string>('MONGO_DB_URI_STORAGE'));
    return {
      uri: this.configService.get<string>('MONGO_DB_URI_STORAGE'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  }
}
