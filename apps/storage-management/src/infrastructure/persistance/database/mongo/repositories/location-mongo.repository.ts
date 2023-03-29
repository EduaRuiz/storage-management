import { LocationMongoSchema } from '../schemas';
import { IRepositoryBase } from './interfaces';
import {
  Observable,
  catchError,
  from,
  iif,
  map,
  of,
  switchMap,
  tap,
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
  implements IRepositoryBase<LocationMongoSchema>
{
  constructor(
    @InjectModel(LocationMongoSchema.name)
    private locationMongoEntity: Model<LocationMongoSchema>,
  ) {}

  create(entity: LocationMongoSchema): Observable<LocationMongoSchema> {
    return from(this.locationMongoEntity.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Location create conflict', error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: LocationMongoSchema,
  ): Observable<LocationMongoSchema> {
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

  delete(entityId: string): Observable<LocationMongoSchema> {
    return this.findOneById(entityId).pipe(
      tap(() => {
        return from(
          this.locationMongoEntity.findByIdAndDelete(
            { _id: entityId.toString() },
            { new: true },
          ),
        ).pipe(map((entity: LocationMongoSchema) => entity));
      }),
    );
  }

  findAll(): Observable<LocationMongoSchema[]> {
    return from(this.locationMongoEntity.find().exec()).pipe(
      map((entities: LocationMongoSchema[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<LocationMongoSchema> {
    return from(
      this.locationMongoEntity.findById({ _id: entityId.toString() }),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Location invalid ID format',
          error.message,
        );
      }),
      switchMap((location: LocationMongoSchema) =>
        iif(
          () => location === null,
          throwError(() => new NotFoundException('Location not found')),
          of(location),
        ),
      ),
    );
  }
}
