import { InjectRepository } from '@nestjs/typeorm';
import { ProductMongoEntity } from '../schemas/product-mongo.entity';
import { IRepositoryBase } from './interfaces';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  findBy(
    options: FindOptionsWhere<ProductMongoEntity>,
  ): Observable<ProductMongoEntity[]> {
    return from(this.productMongoEntity.findBy(options));
  }

  create(entity: ProductMongoEntity): Observable<ProductMongoEntity> {
    return from(this.productMongoEntity.save(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Product create conflict', error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: ProductMongoEntity,
  ): Observable<ProductMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((currentEntity: ProductMongoEntity) => {
        entity = { ...currentEntity, ...entity, _id: currentEntity._id };
        return from(this.productMongoEntity.save(entity)).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Product update conflict',
              error.message,
            );
          }),
        );
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
    return from(this.productMongoEntity.findOneById(entityId)).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product: ProductMongoEntity) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Product not found')),
          of(product),
        ),
      ),
    );
  }
}
