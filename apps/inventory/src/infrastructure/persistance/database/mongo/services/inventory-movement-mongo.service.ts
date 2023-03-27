import { Observable, from, map, switchMap } from 'rxjs';
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
  findAllByProductId(
    productId: string,
  ): Observable<InventoryMovementMongoEntity[]> {
    return this.inventoryMovementMongoRepository.findAll().pipe(
      map((inventoryMovements: InventoryMovementMongoEntity[]) => {
        return inventoryMovements.filter(
          (inventoryMovement: InventoryMovementMongoEntity) => {
            return (
              inventoryMovement.stock.product._id.toString() ===
              productId.toString()
            );
          },
        );
      }),
    );
  }
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
            return (
              inventoryMovement.stock._id.toString() === stockId.toString()
            );
          },
        );
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryMovementMongoEntity> {
    return this.inventoryMovementMongoRepository.findOneById(entityId);
  }
}
