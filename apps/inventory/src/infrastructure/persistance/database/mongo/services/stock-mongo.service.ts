import { Observable, from, map, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ProductMongoRepository, StockMongoRepository } from '../repositories';
import { ProductMongoEntity, StockMongoEntity } from '../schemas';
import { IStockDomainService } from 'apps/inventory/src/domain/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StockMongoService
  implements IStockDomainService<StockMongoEntity>
{
  constructor(
    private readonly stockMongoRepository: StockMongoRepository,
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}

  findByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Observable<StockMongoEntity> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoEntity[]) => {
        return stocks.find((stock: StockMongoEntity) => {
          return (
            stock.product._id === productId && stock.locationId === locationId
          );
        });
      }),
    );
  }

  createStock(
    productId: string,
    entity: StockMongoEntity,
  ): Observable<StockMongoEntity> {
    return from(this.productMongoRepository.findOneById(productId)).pipe(
      switchMap((product: ProductMongoEntity) => {
        return this.stockMongoRepository.create({ ...entity, product });
      }),
    );
  }

  updateQuantity(
    entityId: string,
    entity: StockMongoEntity,
  ): Observable<StockMongoEntity> {
    return this.stockMongoRepository.findOneById(entityId).pipe(
      switchMap((currentEntity: StockMongoEntity) => {
        currentEntity = {
          ...currentEntity,
          quantity: entity.quantity,
          _id: entityId,
        };
        return this.stockMongoRepository.update(entityId, currentEntity);
      }),
    );
  }

  findAllByProductId(productId: string): Observable<StockMongoEntity[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoEntity[]) => {
        return stocks.filter((stock: StockMongoEntity) => {
          return stock.product._id === productId;
        });
      }),
    );
  }

  findAllByLocationId(locationId: string): Observable<StockMongoEntity[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoEntity[]) => {
        return stocks.filter((stock: StockMongoEntity) => {
          return stock.locationId === locationId;
        });
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoEntity> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
