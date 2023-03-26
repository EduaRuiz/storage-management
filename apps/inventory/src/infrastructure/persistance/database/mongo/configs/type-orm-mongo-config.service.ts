import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ProductMongoEntity } from '../schemas/product-mongo.entity';
import { InventoryMovementMongoEntity, StockMongoEntity } from '../schemas';

@Injectable()
export class TypeOrmMongoConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      // name: 'mongo',
      host: this.configService.get<string>('MONGO_DB_HOST'),
      port: this.configService.get<number>('MONGO_DB_PORT'),
      // username: this.configService.get<string>('MONGO_DB_USER'),
      // password: this.configService.get<string>('MONGO_DB_PASSWORD'),
      database: this.configService.get<string>('MONGO_DB_NAME_INVENTORY'),
      entities: [
        ProductMongoEntity,
        StockMongoEntity,
        InventoryMovementMongoEntity,
      ],
      useNewUrlParser: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      synchronize: true,
      logging: true,
    };
  }
}
