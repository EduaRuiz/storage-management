import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import { ProductMongoRepository, StockMongoRepository } from '../repositories';
import { ProductMongoEntity, StockMongoEntity } from '../schemas';
import { IStockDomainService } from 'apps/inventory/src/domain/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StockMongoService
  implements IStockDomainService<StockMongoEntity>
{
  constructor(
    private readonly stockMongoRepository: StockMongoRepository,
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}

  findByProductIdAndLocationId(
    locationId: string,
    productId: string,
  ): Observable<StockMongoEntity> {
    return this.stockMongoRepository.findAll().pipe(
      switchMap((stocks: StockMongoEntity[]) => {
        const stock = stocks.filter((stock: StockMongoEntity) => {
          return (
            stock.product._id.toString() === productId.toString() &&
            stock.locationId.toString() === locationId.toString()
          );
        });
        return stock.length > 0
          ? of(stock[0])
          : throwError(() => new NotFoundException('Stock not found'));
      }),
    );
  }

  createStock(
    productId: string,
    entity: StockMongoEntity,
  ): Observable<StockMongoEntity> {
    return from(this.productMongoRepository.findOneById(productId)).pipe(
      switchMap((product: ProductMongoEntity) => {
        return this.stockMongoRepository.create({
          ...entity,
          product,
        });
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
          return stock.product._id.toString() === productId.toString();
        });
      }),
    );
  }

  findAllByLocationId(locationId: string): Observable<StockMongoEntity[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoEntity[]) => {
        return stocks.filter((stock: StockMongoEntity) => {
          return stock.locationId.toString() === locationId.toString();
        });
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoEntity> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
