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
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InventoryTransferMongoModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class InventoryTransferMongoRepository
  implements IRepositoryBase<InventoryTransferMongoModel>
{
  constructor(
    @InjectModel(InventoryTransferMongoModel.name)
    private inventoryTransferMongoEntity: Model<InventoryTransferMongoModel>,
  ) {}

  create(
    entity: InventoryTransferMongoModel,
  ): Observable<InventoryTransferMongoModel> {
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
    entity: InventoryTransferMongoModel,
  ): Observable<InventoryTransferMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
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
        );
      }),
    );
  }

  delete(entityId: string): Observable<InventoryTransferMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return this.inventoryTransferMongoEntity.findByIdAndDelete({
          _id: entityId,
          populate: 'stock',
        });
      }),
    );
  }

  findAll(): Observable<InventoryTransferMongoModel[]> {
    return from(this.inventoryTransferMongoEntity.find().exec()).pipe(
      map((entities: InventoryTransferMongoModel[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryTransferMongoModel> {
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
      switchMap((product: InventoryTransferMongoModel) =>
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
