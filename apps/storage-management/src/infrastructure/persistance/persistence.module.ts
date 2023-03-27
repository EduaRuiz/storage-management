import { Module } from '@nestjs/common';
import { PostgresModule } from './database/postgres/postgres.module';
import { MongoModule } from './database/mongo/mongo.module';
import {
  InventoryMovementService,
  ProductService,
  StockService,
} from './services';

/**
 * Modulo de persistencia
 *
 * @export
 * @class PersistenceModule
 */
@Module({
  imports: [MongoModule, PostgresModule],
  controllers: [],
  providers: [ProductService, StockService, InventoryMovementService],
  exports: [ProductService, StockService, InventoryMovementService],
})
export class PersistenceModule {}
