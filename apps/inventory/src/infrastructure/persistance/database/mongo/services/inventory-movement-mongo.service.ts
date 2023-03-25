import { Observable } from 'rxjs';
import { InventoryMovementMongoRepository } from '../repositories';
import { InventoryMovementMongoEntity } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IInventoryMovementDomainService } from 'apps/inventory/src/domain/services';

@Injectable()
export class InventoryMovementMongoService
  implements IInventoryMovementDomainService<InventoryMovementMongoEntity>
{
  constructor(
    private readonly inventoryMovementMongoRepository: InventoryMovementMongoRepository,
  ) {}

  create(
    entity: InventoryMovementMongoEntity,
  ): Observable<InventoryMovementMongoEntity> {
    return this.inventoryMovementMongoRepository.create(entity);
  }

  update(
    entityId: string,
    entity: InventoryMovementMongoEntity,
  ): Observable<InventoryMovementMongoEntity> {
    return this.inventoryMovementMongoRepository.update(entityId, entity);
  }

  delete(entityId: string): Observable<InventoryMovementMongoEntity> {
    return this.inventoryMovementMongoRepository.delete(entityId);
  }

  findAll(): Observable<InventoryMovementMongoEntity[]> {
    return this.inventoryMovementMongoRepository.findAll();
  }

  findOneById(entityId: string): Observable<InventoryMovementMongoEntity> {
    return this.inventoryMovementMongoRepository.findOneById(entityId);
  }
}
