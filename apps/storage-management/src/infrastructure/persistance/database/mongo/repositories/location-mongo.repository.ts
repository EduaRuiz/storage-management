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
  throwError,
} from 'rxjs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class LocationMongoRepository
  implements IRepositoryBase<LocationMongoSchema>
{
  constructor(
    @InjectModel(LocationMongoSchema.name)
    private productMongoEntity: Model<LocationMongoSchema>,
  ) {}

  create(entity: LocationMongoSchema): Observable<LocationMongoSchema> {
    return from(this.productMongoEntity.create(entity)).pipe(
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
      switchMap((currentEntity: LocationMongoSchema) => {
        entity = { ...currentEntity, ...entity, _id: currentEntity._id };
        return from(this.productMongoEntity.findOneAndUpdate(entity)).pipe(
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
      switchMap((entity: LocationMongoSchema) => {
        return from(this.productMongoEntity.findByIdAndDelete(entity)).pipe(
          map((entity: LocationMongoSchema) => entity),
        );
      }),
    );
  }

  findAll(): Observable<LocationMongoSchema[]> {
    return from(this.productMongoEntity.find().exec()).pipe(
      map((entities: LocationMongoSchema[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<LocationMongoSchema> {
    return from(this.productMongoEntity.findById(entityId)).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product: LocationMongoSchema) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Location not found')),
          of(product),
        ),
      ),
    );
  }
}
