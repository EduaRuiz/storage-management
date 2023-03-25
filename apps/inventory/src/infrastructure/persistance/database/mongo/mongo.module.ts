import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmMongoConfigService } from './configs';
import {
  InventoryMovementMongoEntity,
  ProductMongoEntity,
  StockMongoEntity,
} from './schemas';
import {
  InventoryMovementMongoRepository,
  ProductMongoRepository,
  StockMongoRepository,
} from './repositories';
import {
  InventoryMovementMongoService,
  ProductMongoService,
  StockMongoService,
} from './services';

/**
 * Modulo de Mongo
 *
 * @export
 * @class MongoModule
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmMongoConfigService,
    }),
    TypeOrmModule.forFeature([
      ProductMongoEntity,
      StockMongoEntity,
      InventoryMovementMongoEntity,
    ]),
  ],
  controllers: [],
  providers: [
    // TypeOrmMongoConfigService,
    ProductMongoRepository,
    ProductMongoService,
    StockMongoRepository,
    StockMongoService,
    InventoryMovementMongoRepository,
    InventoryMovementMongoService,
  ],
  exports: [
    // TypeOrmMongoConfigService,
    ProductMongoRepository,
    ProductMongoService,
    StockMongoRepository,
    StockMongoService,
    InventoryMovementMongoRepository,
    InventoryMovementMongoService,
  ],
})
export class MongoModule {}
