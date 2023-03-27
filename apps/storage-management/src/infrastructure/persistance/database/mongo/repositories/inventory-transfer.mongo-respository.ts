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
import { IRepositoryBase } from './interfaces';
import { ConflictException, NotFoundException } from '@nestjs/common';
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
    this.findOneById(entityId).pipe(
      map((currentEntity: InventoryTransferMongoSchema) => {
        currentEntity = { ...currentEntity, ...entity, _id: entityId };
        entity = currentEntity;
      }),
    );
    return from(this.inventoryTransferMongoEntity.findOneAndUpdate(entity));
  }

  delete(entityId: string): Observable<InventoryTransferMongoSchema> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: InventoryTransferMongoSchema) => {
        return from(
          this.inventoryTransferMongoEntity.findOneAndDelete(entity),
        ).pipe(map((entity: InventoryTransferMongoSchema) => entity));
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
    return from(this.inventoryTransferMongoEntity.findById(entityId)).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product: InventoryTransferMongoSchema) =>
        iif(
          () => product === null,
          throwError(
            () => new NotFoundException('InventoryTransfer not found'),
          ),
          of(product),
        ),
      ),
    );
  }
}
