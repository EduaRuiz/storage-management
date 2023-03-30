import { Module } from '@nestjs/common';
import { MongooseConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryTransferMongoModel,
  InventoryTransferSchema,
  LocationMongoModel,
  LocationSchema,
  StockMongoModel,
  StockSchema,
} from './models';
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
    // MongooseModule.forRoot(
    //   'mongodb://root:password@localhost:27017/storage?authSource=admin',
    // ),
    MongooseModule.forFeature([
      { name: LocationMongoModel.name, schema: LocationSchema },
      { name: StockMongoModel.name, schema: StockSchema },
      {
        name: InventoryTransferMongoModel.name,
        schema: InventoryTransferSchema,
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
