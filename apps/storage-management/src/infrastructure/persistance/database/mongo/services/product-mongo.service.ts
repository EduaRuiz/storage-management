import { Observable, map, switchMap } from 'rxjs';
import { ProductMongoEntity, StockMongoEntity } from '../schemas';
import { IProductDomainService } from 'apps/inventory/src/domain/services';
import { Injectable } from '@nestjs/common';
import { ProductMongoRepository, StockMongoRepository } from '../repositories';

@Injectable()
export class ProductMongoService
  implements IProductDomainService<ProductMongoEntity>
{
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}

  create(entity: ProductMongoEntity): Observable<ProductMongoEntity> {
    return this.productMongoRepository.create(entity);
  }

  update(
    entityId: string,
    entity: ProductMongoEntity,
  ): Observable<ProductMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((product: ProductMongoEntity) => {
        entity = { ...product, ...entity, _id: product._id };
        return this.getStocksByProductId(product._id).pipe(
          switchMap((stocks: StockMongoEntity[]) => {
            return this.updateStocks(entity, stocks);
          }),
        );
      }),
    );
  }

  delete(entityId: string): Observable<ProductMongoEntity> {
    return this.productMongoRepository.delete(entityId);
  }

  findAll(): Observable<ProductMongoEntity[]> {
    return this.productMongoRepository.findAll();
  }

  findOneById(entityId: string): Observable<ProductMongoEntity> {
    return this.productMongoRepository.findOneById(entityId);
  }

  private getStocksByProductId(
    productId: string,
  ): Observable<StockMongoEntity[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoEntity[]) => {
        return stocks.filter((stock: StockMongoEntity) => {
          return stock.product._id.toString() === productId.toString();
        });
      }),
    );
  }

  private updateStocks(
    product: ProductMongoEntity,
    stocks: StockMongoEntity[],
  ): Observable<ProductMongoEntity> {
    const productUpdated = this.productMongoRepository.update(
      product._id,
      product,
    );
    for (const stock of stocks) {
      stock.product = product;
      this.stockMongoRepository.update(stock._id, stock).subscribe();
    }
    return productUpdated;
  }
}
