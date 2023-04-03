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
   * @param {Model<StockMongoModel>} stockMongoModel Modelo de datos de stock para MongoDB
   * @memberof StockMongoRepository
   */
  constructor(
    @InjectModel(StockMongoModel.name)
    private stockMongoModel: Model<StockMongoModel>,
  ) {}

  /**
   * Crear un stock
   *
   * @param {StockMongoModel} entity Stock
   * @return {Observable<StockMongoModel>} Observable de stock creado
   * @memberof StockMongoRepository
   */
  create(entity: StockMongoModel): Observable<StockMongoModel> {
    return from(this.stockMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Stock create conflict', error.message);
      }),
    );
  }

  /**
   * Actualizar un stock
   *
   * @param {string} entityId ID del stock
   * @param {StockMongoModel} entity Stock
   * @return {Observable<StockMongoModel>} Observable de stock actualizado
   * @memberof StockMongoRepository
   */
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
            throw new ConflictException('Stock update conflict', error.message);
          }),
        );
      }),
    );
  }

  /**
   * Eliminar un stock
   *
   * @param {string} entityId ID del stock
   * @return {Observable<StockMongoModel>} Observable de stock eliminado
   * @memberof StockMongoRepository
   */
  delete(entityId: string): Observable<StockMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return this.stockMongoModel.findByIdAndDelete({
          _id: entityId.toString(),
          populate: 'product',
        });
      }),
    );
  }

  /**
   * Obtener todos los stocks
   *
   * @return {Observable<StockMongoModel[]>} Observable de stocks
   * @memberof StockMongoRepository
   */
  findAll(): Observable<StockMongoModel[]> {
    return from(
      this.stockMongoModel.find({}, {}, { populate: 'product' }).exec(),
    ).pipe(
      map((entities: StockMongoModel[]) => {
        return entities;
      }),
    );
  }

  /**
   * Obtener un stock por ID
   *
   * @param {string} entityId ID del stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoRepository
   */
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
