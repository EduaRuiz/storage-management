import {
  Observable,
  catchError,
  from,
  iif,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { IRepositoryBase } from './interfaces';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockMongoModel } from '../models';

export class StockMongoRepository implements IRepositoryBase<StockMongoModel> {
  constructor(
    @InjectModel(StockMongoModel.name)
    private stockMongoModel: Model<StockMongoModel>,
  ) {}

  create(entity: StockMongoModel): Observable<StockMongoModel> {
    return from(this.stockMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Stock create conflict', error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: StockMongoModel,
  ): Observable<StockMongoModel> {
    return this.findOneById(entityId).pipe(
      mergeMap(() => {
        return from(
          this.stockMongoModel.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true, populate: 'product' },
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

  delete(entityId: string): Observable<StockMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: StockMongoModel) => {
        entity.deleteOne({ _id: entityId.toString(), populate: 'product' });
        return of(entity);
      }),
    );
  }

  findAll(): Observable<StockMongoModel[]> {
    return from(
      this.stockMongoModel.find({}, {}, { populate: 'product' }).exec(),
    ).pipe(
      map((entities: StockMongoModel[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoModel> {
    return from(
      this.stockMongoModel.findById(
        { _id: entityId.toString() },
        {},
        { populate: 'product' },
      ),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException('Stock invalid ID format', error.message);
      }),
      switchMap((product: StockMongoModel) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Stock not found')),
          of(product),
        ),
      ),
    );
  }
}
