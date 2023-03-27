import { Module } from '@nestjs/common';
import { PostgresModule } from './database/postgres/postgres.module';
import { MongoModule } from './database/mongo/mongo.module';
import {
  InventoryTransferService,
  LocationService,
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
  providers: [LocationService, StockService, InventoryTransferService],
  exports: [LocationService, StockService, InventoryTransferService],
})
export class PersistenceModule {}
