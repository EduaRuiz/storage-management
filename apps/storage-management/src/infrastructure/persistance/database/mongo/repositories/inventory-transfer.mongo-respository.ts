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
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InventoryTransferMongoSchema } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class InventoryTransferMongoRepository
  implements IRepositoryBase<InventoryTransferMongoSchema>
{
  constructor(
    @InjectModel(InventoryTransferMongoSchema.name)
    private inventoryTransferMongoEntity: Model<InventoryTransferMongoSchema>,
  ) {}

  create(
    entity: InventoryTransferMongoSchema,
  ): Observable<InventoryTransferMongoSchema> {
    return from(this.inventoryTransferMongoEntity.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(
          'Inventory transfer create conflict',
          error.message,
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: InventoryTransferMongoSchema,
  ): Observable<InventoryTransferMongoSchema> {
    return this.findOneById(entityId).pipe(
      tap(() => {
        return from(
          this.inventoryTransferMongoEntity.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true, populate: 'stock' },
          ),
        ).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Inventory transfer update conflict',
              error.message,
            );
          }),
          map((location: InventoryTransferMongoSchema) => location),
        );
      }),
    );
  }

  delete(entityId: string): Observable<InventoryTransferMongoSchema> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: InventoryTransferMongoSchema) => {
        entity.deleteOne({ _id: entityId });
        return of(entity);
      }),
    );
  }

  findAll(): Observable<InventoryTransferMongoSchema[]> {
    return from(this.inventoryTransferMongoEntity.find().exec()).pipe(
      map((entities: InventoryTransferMongoSchema[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryTransferMongoSchema> {
    return from(
      this.inventoryTransferMongoEntity.findById(
        { _id: entityId.toString() },
        {},
        { populate: 'stock' },
      ),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Inventory transfer invalid ID format',
          error.message,
        );
      }),
      switchMap((product: InventoryTransferMongoSchema) =>
        iif(
          () => product === null,
          throwError(
            () => new NotFoundException('Inventory transfer not found'),
          ),
          of(product),
        ),
      ),
    );
  }
}
