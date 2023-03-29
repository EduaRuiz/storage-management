import {
  Observable,
  flatMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { LocationMongoRepository, StockMongoRepository } from '../repositories';
import { StockMongoSchema } from '../schemas';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IStockDomainService } from 'apps/storage-management/src/domain/services';

@Injectable()
export class StockMongoService
  implements IStockDomainService<StockMongoSchema>
{
  constructor(
    private readonly stockMongoRepository: StockMongoRepository,
    private readonly locationMongoRepository: LocationMongoRepository,
  ) {}

  findOneByLocationIdAndProductId(
    locationId: string,
    productId: string,
  ): Observable<StockMongoSchema> {
    return this.stockMongoRepository.findAll().pipe(
      switchMap((stocks: StockMongoSchema[]) => {
        const stock = stocks.filter((stock: StockMongoSchema) => {
          return (
            stock.productId.toString() === productId.toString() &&
            stock.location._id.toString() === locationId.toString()
          );
        });
        return stock.length > 0
          ? of(stock[0])
          : throwError(() => new NotFoundException('Stock not found'));
      }),
    );
  }

  createStock(entity: StockMongoSchema): Observable<StockMongoSchema> {
    return this.stockMongoRepository.create(entity);
  }

  updateQuantity(
    entityId: string,
    entity: StockMongoSchema,
  ): Observable<StockMongoSchema> {
    return this.stockMongoRepository.findOneById(entityId).pipe(
      mergeMap((stock: StockMongoSchema) => {
        stock.quantity = entity.quantity;
        return this.stockMongoRepository.update(entityId, stock);
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoSchema> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
