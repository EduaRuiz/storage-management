import { Observable } from 'rxjs';
import { StockMongoRepository } from '../repositories';
import { StockMongoEntity } from '../schemas';
import { IStockDomainService } from 'apps/inventory/src/domain/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StockMongoService
  implements IStockDomainService<StockMongoEntity>
{
  constructor(private readonly stockMongoRepository: StockMongoRepository) {}

  create(entity: StockMongoEntity): Observable<StockMongoEntity> {
    return this.stockMongoRepository.create(entity);
  }

  update(
    entityId: string,
    entity: StockMongoEntity,
  ): Observable<StockMongoEntity> {
    return this.stockMongoRepository.update(entityId, entity);
  }

  delete(entityId: string): Observable<StockMongoEntity> {
    return this.stockMongoRepository.delete(entityId);
  }

  findAll(): Observable<StockMongoEntity[]> {
    return this.stockMongoRepository.findAll();
  }

  findOneById(entityId: string): Observable<StockMongoEntity> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
