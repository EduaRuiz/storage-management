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
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InventoryMovementMongoEntity } from '../schemas';

export class InventoryMovementMongoRepository
  implements IRepositoryBase<InventoryMovementMongoEntity>
{
  constructor(
    @InjectRepository(InventoryMovementMongoEntity)
    private inventoryMovementMongoEntity: Repository<InventoryMovementMongoEntity>,
  ) {}
  findBy(
    options: FindOptionsWhere<InventoryMovementMongoEntity>,
  ): Observable<InventoryMovementMongoEntity[]> {
    return from(this.inventoryMovementMongoEntity.findBy(options));
  }

  create(
    entity: InventoryMovementMongoEntity,
  ): Observable<InventoryMovementMongoEntity> {
    return from(this.inventoryMovementMongoEntity.save(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: InventoryMovementMongoEntity,
  ): Observable<InventoryMovementMongoEntity> {
    this.findOneById(entityId).pipe(
      map((currentEntity: InventoryMovementMongoEntity) => {
        currentEntity = { ...currentEntity, ...entity, _id: entityId };
        entity = currentEntity;
      }),
    );
    return from(this.inventoryMovementMongoEntity.save(entity));
  }

  delete(entityId: string): Observable<InventoryMovementMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: InventoryMovementMongoEntity) => {
        return from(this.inventoryMovementMongoEntity.remove(entity)).pipe(
          map((entity: InventoryMovementMongoEntity) => entity),
        );
      }),
    );
  }

  findAll(): Observable<InventoryMovementMongoEntity[]> {
    return from(this.inventoryMovementMongoEntity.find()).pipe(
      map((entities: InventoryMovementMongoEntity[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryMovementMongoEntity> {
    return from(this.inventoryMovementMongoEntity.findOneById(entityId)).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product: InventoryMovementMongoEntity) =>
        iif(
          () => product === null,
          throwError(
            () => new NotFoundException('InventoryMovement not found'),
          ),
          of(product),
        ),
      ),
    );
  }
}
