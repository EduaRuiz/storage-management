import { Module } from '@nestjs/common';
import { MongooseConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryMovementMongoModel,
  InventoryMovementSchema,
  ProductMongoModel,
  ProductSchema,
  StockMongoModel,
  StockSchema,
} from './models';
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
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    // MongooseModule.forRoot(
    //   'mongodb://root:password@localhost:27017/inventory?authSource=admin',
    // ),
    MongooseModule.forFeature([
      { name: ProductMongoModel.name, schema: ProductSchema },
      { name: StockMongoModel.name, schema: StockSchema },
      {
        name: InventoryMovementMongoModel.name,
        schema: InventoryMovementSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [
    MongooseConfigService,
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
