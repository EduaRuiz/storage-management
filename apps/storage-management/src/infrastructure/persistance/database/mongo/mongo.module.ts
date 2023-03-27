import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseConfigService, TypeOrmMongoConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryMovementMongoSchema,
  ProductMongoSchema,
  StockMongoSchema,
} from './schemas';
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
    // MongooseModule.forRootAsync({
    //   useClass: MongooseConfigService,
    // }),
    // MongooseModule.forFeature([
    //   { name: ProductMongoSchema.name, schema: ProductMongoSchema },
    //   { name: StockMongoSchema.name, schema: StockMongoSchema },
    //   {
    //     name: InventoryMovementMongoSchema.name,
    //     schema: InventoryMovementMongoSchema,
    //   },
    // ]),
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
