import { Observable, from, map, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import {
  InventoryMovementMongoRepository,
  StockMongoRepository,
} from '../repositories';
import { InventoryMovementMongoEntity, StockMongoEntity } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IInventoryMovementDomainService } from 'apps/inventory/src/domain/services';

@Injectable()
export class InventoryMovementMongoService
  implements IInventoryMovementDomainService<InventoryMovementMongoEntity>
{
  constructor(
    private readonly inventoryMovementMongoRepository: InventoryMovementMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}
  create(
    stockId: string,
    entity: InventoryMovementMongoEntity,
  ): Observable<InventoryMovementMongoEntity> {
    return from(this.stockMongoRepository.findOneById(stockId)).pipe(
      switchMap((stock: StockMongoEntity) => {
        return this.inventoryMovementMongoRepository.create({
          ...entity,
          stock,
        });
      }),
    );
  }

  findAllByStockId(
    stockId: string,
  ): Observable<InventoryMovementMongoEntity[]> {
    return this.inventoryMovementMongoRepository.findAll().pipe(
      map((inventoryMovements: InventoryMovementMongoEntity[]) => {
        return inventoryMovements.filter(
          (inventoryMovement: InventoryMovementMongoEntity) => {
            return inventoryMovement.stock._id === stockId;
          },
        );
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryMovementMongoEntity> {
    return this.inventoryMovementMongoRepository.findOneById(entityId);
  }
}
