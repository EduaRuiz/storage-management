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
import { StockMongoSchema } from '../schemas';
import { IRepositoryBase } from './interfaces';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class StockMongoRepository implements IRepositoryBase<StockMongoSchema> {
  constructor(
    @InjectModel(StockMongoSchema.name)
    private stockMongoEntity: Model<StockMongoSchema>,
  ) {}

  create(entity: StockMongoSchema): Observable<StockMongoSchema> {
    return from(this.stockMongoEntity.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Stock create conflict', error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: StockMongoSchema,
  ): Observable<StockMongoSchema> {
    return this.findOneById(entityId).pipe(
      switchMap((currentEntity: StockMongoSchema) => {
        entity = { ...currentEntity, ...entity, _id: currentEntity._id };
        return from(this.stockMongoEntity.findOneAndUpdate(entity)).pipe(
          catchError((error: Error) => {
            throw new ConflictException('Stock update conflict', error.message);
          }),
        );
      }),
    );
  }

  delete(entityId: string): Observable<StockMongoSchema> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: StockMongoSchema) => {
        return from(this.stockMongoEntity.findOneAndDelete(entity));
      }),
    );
  }

  findAll(): Observable<StockMongoSchema[]> {
    return from(this.stockMongoEntity.find().exec()).pipe(
      map((entities: StockMongoSchema[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoSchema> {
    return from(this.stockMongoEntity.findById(entityId)).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product: StockMongoSchema) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Stock not found')),
          of(product),
        ),
      ),
    );
  }
}
