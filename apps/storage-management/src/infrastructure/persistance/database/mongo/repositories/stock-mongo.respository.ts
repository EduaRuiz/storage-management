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
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mergeMap } from 'rxjs';

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
      mergeMap(() => {
        return from(
          this.stockMongoEntity.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true, populate: 'location' },
          ),
        ).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Location update conflict',
              error.message,
            );
          }),
        );
      }),
    );
  }

  delete(entityId: string): Observable<StockMongoSchema> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: StockMongoSchema) => {
        entity.deleteOne({ _id: entityId.toString() });
        return of(entity);
      }),
    );
  }

  findAll(): Observable<StockMongoSchema[]> {
    return from(
      this.stockMongoEntity.find({}, {}, { populate: 'location' }).exec(),
    ).pipe(
      map((entities: StockMongoSchema[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoSchema> {
    return from(
      this.stockMongoEntity.findById(
        { _id: entityId.toString() },
        {},
        { populate: 'location' },
      ),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException('Stock invalid ID format', error.message);
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
