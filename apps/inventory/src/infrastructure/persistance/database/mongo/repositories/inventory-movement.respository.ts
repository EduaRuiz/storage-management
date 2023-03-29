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
import { IRepositoryBase } from './interfaces';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InventoryMovementMongoModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class InventoryMovementMongoRepository
  implements IRepositoryBase<InventoryMovementMongoModel>
{
  constructor(
    @InjectModel(InventoryMovementMongoModel.name)
    private inventoryMovementMongoModel: Model<InventoryMovementMongoModel>,
  ) {}

  create(
    entity: InventoryMovementMongoModel,
  ): Observable<InventoryMovementMongoModel> {
    return from(this.inventoryMovementMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(
          'Inventory movement create conflict',
          error.message,
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: InventoryMovementMongoModel,
  ): Observable<InventoryMovementMongoModel> {
    return this.findOneById(entityId).pipe(
      tap(() => {
        return from(
          this.inventoryMovementMongoModel.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true, populate: 'stock' },
          ),
        ).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Inventory movement update conflict',
              error.message,
            );
          }),
          map((location: InventoryMovementMongoModel) => location),
        );
      }),
    );
  }

  delete(entityId: string): Observable<InventoryMovementMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: InventoryMovementMongoModel) => {
        entity.deleteOne({ _id: entityId });
        return of(entity);
      }),
    );
  }

  findAll(): Observable<InventoryMovementMongoModel[]> {
    return from(this.inventoryMovementMongoModel.find().exec()).pipe(
      map((entities: InventoryMovementMongoModel[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryMovementMongoModel> {
    return from(
      this.inventoryMovementMongoModel.findById(
        { _id: entityId.toString() },
        {},
        { populate: 'stock' },
      ),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Inventory movement invalid ID format',
          error.message,
        );
      }),
      switchMap((product: InventoryMovementMongoModel) =>
        iif(
          () => product === null,
          throwError(
            () => new NotFoundException('Inventory movement not found'),
          ),
          of(product),
        ),
      ),
    );
  }
}
