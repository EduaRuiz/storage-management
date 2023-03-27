import { InjectRepository } from '@nestjs/typeorm';
import { ProductMongoEntity } from '../schemas/product-mongo.entity';
import { IRepositoryBase } from './interfaces';
import { Repository } from 'typeorm';
import {
  Observable,
  catchError,
  from,
  iif,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class ProductMongoRepository
  implements IRepositoryBase<ProductMongoEntity>
{
  constructor(
    @InjectRepository(ProductMongoEntity)
    private productMongoEntity: Repository<ProductMongoEntity>,
  ) {}

  create(entity: ProductMongoEntity): Observable<ProductMongoEntity> {
    return from(this.productMongoEntity.save(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: ProductMongoEntity,
  ): Observable<ProductMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((currentEntity: ProductMongoEntity) => {
        currentEntity = { ...currentEntity, ...entity, _id: entityId };
        entity = currentEntity;
        return this.productMongoEntity.save(entity);
      }),
    );
  }

  delete(entityId: string): Observable<ProductMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: ProductMongoEntity) => {
        return from(this.productMongoEntity.remove(entity)).pipe(
          map((entity: ProductMongoEntity) => entity),
        );
      }),
    );
  }

  findAll(): Observable<ProductMongoEntity[]> {
    return from(this.productMongoEntity.find()).pipe(
      map((entities: ProductMongoEntity[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<ProductMongoEntity> {
    return from(
      this.productMongoEntity.findOne({
        where: { _id: entityId },
      }),
    ).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Product not found')),
          of(product),
        ),
      ),
    );
  }
}
