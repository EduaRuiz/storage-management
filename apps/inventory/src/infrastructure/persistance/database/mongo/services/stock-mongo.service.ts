import { Observable, map, mergeMap, of, switchMap, throwError } from 'rxjs';
import { StockMongoRepository } from '../repositories';
import { StockMongoModel } from '../models';
import { IStockDomainService } from 'apps/inventory/src/domain/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StockMongoService implements IStockDomainService<StockMongoModel> {
  constructor(private readonly stockMongoRepository: StockMongoRepository) {}

  findByProductIdAndLocationId(
    locationId: string,
    productId: string,
  ): Observable<StockMongoModel> {
    return this.stockMongoRepository.findAll().pipe(
      switchMap((stocks: StockMongoModel[]) => {
        const stock = stocks.filter((stock: StockMongoModel) => {
          console.log(stock.product._id.toString(), productId.toString());
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

  createStock(entity: StockMongoModel): Observable<StockMongoModel> {
    return this.stockMongoRepository.create(entity);
  }

  updateQuantity(
    entityId: string,
    entity: StockMongoModel,
  ): Observable<StockMongoModel> {
    return this.stockMongoRepository.findOneById(entityId).pipe(
      mergeMap((stock: StockMongoModel) => {
        stock.quantity = entity.quantity;
        return this.stockMongoRepository.update(entityId, stock);
      }),
    );
  }

  findAllByProductId(productId: string): Observable<StockMongoModel[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoModel[]) => {
        return stocks.filter((stock: StockMongoModel) => {
          return stock.product._id.toString() === productId.toString();
        });
      }),
    );
  }

  findAllByLocationId(locationId: string): Observable<StockMongoModel[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoModel[]) => {
        return stocks.filter((stock: StockMongoModel) => {
          return stock.locationId.toString() === locationId.toString();
        });
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoModel> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
