import { Observable, switchMap } from 'rxjs';
import { LocationMongoRepository, StockMongoRepository } from '../repositories';
import { StockMongoSchema } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IStockDomainService } from 'apps/storage-management/src/domain/services';

@Injectable()
export class StockMongoService
  implements IStockDomainService<StockMongoSchema>
{
  constructor(
    private readonly stockMongoRepository: StockMongoRepository,
    private readonly locationMongoRepository: LocationMongoRepository,
  ) {}
  createStock(
    productId: string,
    entity: StockMongoSchema,
  ): Observable<StockMongoSchema> {
    return this.stockMongoRepository.create(entity);
  }
  updateQuantity(
    entityId: string,
    entity: StockMongoSchema,
  ): Observable<StockMongoSchema> {
    return this.stockMongoRepository.findOneById(entityId).pipe(
      switchMap((stock: StockMongoSchema) => {
        entity = { ...stock, quantity: entity.quantity };
        return this.stockMongoRepository.update(entityId, entity);
      }),
    );
  }
  findOneById(entityId: string): Observable<StockMongoSchema> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
