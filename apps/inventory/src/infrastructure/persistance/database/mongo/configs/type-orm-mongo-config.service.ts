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
      host: 'localhost',
      port: 27017,
      username: 'root1',
      password: 'password1',
      database: 'od',
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
