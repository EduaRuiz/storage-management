import { LocationMongoModel } from '../models';
import { IRepositoryBase } from './interfaces';
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
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mergeMap } from 'rxjs';

/**
 * Repositorio de ubicación en MongoDB
 *
 * @export
 * @class LocationMongoRepository
 * @implements {IRepositoryBase<LocationMongoModel>}
 */
export class LocationMongoRepository
  implements IRepositoryBase<LocationMongoModel>
{
  /**
   * Crea una instancia de LocationMongoRepository
   *
   * @param {Model<LocationMongoModel>} locationMongoEntity Modelo de ubicación en MongoDB
   * @memberof LocationMongoRepository
   */
  constructor(
    @InjectModel(LocationMongoModel.name)
    private locationMongoEntity: Model<LocationMongoModel>,
  ) {}

  /**
   * Crea una ubicación
   *
   * @param {LocationMongoModel} entity Ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoRepository
   */
  create(entity: LocationMongoModel): Observable<LocationMongoModel> {
    return from(this.locationMongoEntity.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Location create conflict', error.message);
      }),
    );
  }

  /**
   * Actualiza una ubicación
   *
   * @param {string} entityId ID de la ubicación
   * @param {LocationMongoModel} entity Ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoRepository
   */
  update(
    entityId: string,
    entity: LocationMongoModel,
  ): Observable<LocationMongoModel> {
    return this.findOneById(entityId).pipe(
      mergeMap(() => {
        return from(
          this.locationMongoEntity.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true },
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

  /**
   * Elimina una ubicación
   *
   * @param {string} entityId ID de la ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoRepository
   */
  delete(entityId: string): Observable<LocationMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return from(
          this.locationMongoEntity.findByIdAndDelete(
            { _id: entityId.toString() },
            { new: true },
          ),
        );
      }),
    );
  }

  /**
   * Obtiene todas las ubicaciones
   *
   * @return {Observable<LocationMongoModel[]>} Observable de ubicaciones
   * @memberof LocationMongoRepository
   */
  findAll(): Observable<LocationMongoModel[]> {
    return from(this.locationMongoEntity.find().exec()).pipe(
      map((entities: LocationMongoModel[]) => {
        return entities;
      }),
    );
  }

  /**
   * Obtiene una ubicación por su ID
   *
   * @param {string} entityId ID de la ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoRepository
   */
  findOneById(entityId: string): Observable<LocationMongoModel> {
    return from(
      this.locationMongoEntity.findById({ _id: entityId.toString() }),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Location invalid ID format',
          error.message,
        );
      }),
      switchMap((location: LocationMongoModel) =>
        iif(
          () => location === null,
          throwError(() => new NotFoundException('Location not found')),
          of(location),
        ),
      ),
    );
  }
}
