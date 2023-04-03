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
import { StockMongoModel } from '../models';
import { IRepositoryBase } from './interfaces';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mergeMap } from 'rxjs';

/**
 * Repositorio de stock en MongoDB
 *
 * @export
 * @class StockMongoRepository
 * @implements {IRepositoryBase<StockMongoModel>}
 */
export class StockMongoRepository implements IRepositoryBase<StockMongoModel> {
  /**
   * Crea una instancia de StockMongoRepository
   *
   * @param {Model<StockMongoModel>} stockMongoEntity Modelo de stock en MongoDB
   * @memberof StockMongoRepository
   */
  constructor(
    @InjectModel(StockMongoModel.name)
    private stockMongoEntity: Model<StockMongoModel>,
  ) {}

  /**
   * Crea un stock
   *
   * @param {StockMongoModel} entity Stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoRepository
   */
  create(entity: StockMongoModel): Observable<StockMongoModel> {
    return from(this.stockMongoEntity.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Stock create conflict', error.message);
      }),
    );
  }

  /**
   * Actualiza un stock
   *
   * @param {string} entityId ID del stock
   * @param {StockMongoModel} entity Stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoRepository
   */
  update(
    entityId: string,
    entity: StockMongoModel,
  ): Observable<StockMongoModel> {
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
            throw new ConflictException('Stock update conflict', error.message);
          }),
        );
      }),
    );
  }

  /**
   * Elimina un stock
   *
   * @param {string} entityId ID del stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoRepository
   */
  delete(entityId: string): Observable<StockMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return this.stockMongoEntity.findByIdAndDelete({
          _id: entityId.toString(),
          populate: 'location',
        });
      }),
    );
  }

  /**
   * Obtiene todos los stocks
   *
   * @return {Observable<StockMongoModel[]>} Observable de stocks
   * @memberof StockMongoRepository
   */
  findAll(): Observable<StockMongoModel[]> {
    return from(
      this.stockMongoEntity.find({}, {}, { populate: 'location' }).exec(),
    ).pipe(
      map((entities: StockMongoModel[]) => {
        return entities;
      }),
    );
  }

  /**
   * Obtiene un stock por su ID
   *
   * @param {string} entityId ID del stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoRepository
   */
  findOneById(entityId: string): Observable<StockMongoModel> {
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
