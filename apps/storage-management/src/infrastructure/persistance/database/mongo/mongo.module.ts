import { Module } from '@nestjs/common';
import { MongooseConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryTransferMongoSchema,
  LocationMongoSchema,
  StockMongoSchema,
} from './schemas';
import {
  InventoryTransferMongoRepository,
  LocationMongoRepository,
  StockMongoRepository,
} from './repositories';
import {
  InventoryTransferMongoService,
  LocationMongoService,
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
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature([
      { name: LocationMongoSchema.name, schema: LocationMongoSchema },
      { name: StockMongoSchema.name, schema: StockMongoSchema },
      {
        name: InventoryTransferMongoSchema.name,
        schema: InventoryTransferMongoSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [
    MongooseConfigService,
    LocationMongoRepository,
    LocationMongoService,
    StockMongoRepository,
    StockMongoService,
    InventoryTransferMongoRepository,
    InventoryTransferMongoService,
  ],
  exports: [
    LocationMongoRepository,
    LocationMongoService,
    StockMongoRepository,
    StockMongoService,
    InventoryTransferMongoRepository,
    InventoryTransferMongoService,
  ],
})
export class MongoModule {}
