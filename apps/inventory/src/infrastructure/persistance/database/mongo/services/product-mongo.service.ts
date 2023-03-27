import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ProductMongoRepository } from '../repositories/product-mongo.repository';
import { ProductMongoEntity } from '../schemas';
import { IProductDomainService } from 'apps/inventory/src/domain/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductMongoService
  implements IProductDomainService<ProductMongoEntity>
{
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}

  create(entity: ProductMongoEntity): Observable<ProductMongoEntity> {
    return this.productMongoRepository.create(entity);
  }

  update(
    entityId: string,
    entity: ProductMongoEntity,
  ): Observable<ProductMongoEntity> {
    return this.productMongoRepository.update(entityId, entity);
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
}
