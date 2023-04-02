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

export class LocationMongoRepository
  implements IRepositoryBase<LocationMongoModel>
{
  constructor(
    @InjectModel(LocationMongoModel.name)
    private locationMongoEntity: Model<LocationMongoModel>,
  ) {}

  create(entity: LocationMongoModel): Observable<LocationMongoModel> {
    return from(this.locationMongoEntity.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Location create conflict', error.message);
      }),
    );
  }

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

  findAll(): Observable<LocationMongoModel[]> {
    return from(this.locationMongoEntity.find().exec()).pipe(
      map((entities: LocationMongoModel[]) => {
        return entities;
      }),
    );
  }

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
