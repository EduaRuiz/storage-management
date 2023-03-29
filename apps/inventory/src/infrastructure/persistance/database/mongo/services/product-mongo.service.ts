import { Observable } from 'rxjs';
import { ProductMongoModel } from '../models';
import { IProductDomainService } from 'apps/inventory/src/domain/services';
import { Injectable } from '@nestjs/common';
import { ProductMongoRepository } from '../repositories';

@Injectable()
export class ProductMongoService
  implements IProductDomainService<ProductMongoModel>
{
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}

  create(entity: ProductMongoModel): Observable<ProductMongoModel> {
    return this.productMongoRepository.create(entity);
  }

  update(
    entityId: string,
    entity: ProductMongoModel,
  ): Observable<ProductMongoModel> {
    return this.productMongoRepository.update(entityId, entity);
  }

  delete(entityId: string): Observable<ProductMongoModel> {
    return this.productMongoRepository.delete(entityId);
  }

  findAll(): Observable<ProductMongoModel[]> {
    return this.productMongoRepository.findAll();
  }

  findOneById(entityId: string): Observable<ProductMongoModel> {
    return this.productMongoRepository.findOneById(entityId);
  }
}
