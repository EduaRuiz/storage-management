import { Observable, map, tap } from 'rxjs';
import {
  InventoryMovementMongoRepository,
  StockMongoRepository,
} from '../repositories';
import { InventoryMovementMongoModel } from '../models';
import { Injectable } from '@nestjs/common';
import { IInventoryMovementDomainService } from 'apps/inventory/src/domain/services';

@Injectable()
export class InventoryMovementMongoService
  implements IInventoryMovementDomainService<InventoryMovementMongoModel>
{
  constructor(
    private readonly inventoryMovementMongoRepository: InventoryMovementMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}

  findAllByProductId(
    productId: string,
  ): Observable<InventoryMovementMongoModel[]> {
    return this.inventoryMovementMongoRepository.findAll().pipe(
      map((inventoryMovements: InventoryMovementMongoModel[]) => {
        return inventoryMovements.filter(
          (inventoryMovement: InventoryMovementMongoModel) => {
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
    entity: InventoryMovementMongoModel,
  ): Observable<InventoryMovementMongoModel> {
    return this.inventoryMovementMongoRepository.create(entity).pipe(
      tap((inventoryMovement: InventoryMovementMongoModel) => {
        inventoryMovement.typeMovement === 'IN'
          ? (entity.stock.quantity += entity.quantity)
          : (entity.stock.quantity -= entity.quantity);
        this.stockMongoRepository
          .update(entity.stock._id, entity.stock)
          .subscribe();
      }),
    );
  }

  findAllByStockId(stockId: string): Observable<InventoryMovementMongoModel[]> {
    return this.inventoryMovementMongoRepository.findAll().pipe(
      map((inventoryMovements: InventoryMovementMongoModel[]) => {
        return inventoryMovements.filter(
          (inventoryMovement: InventoryMovementMongoModel) => {
            return (
              inventoryMovement.stock._id.toString() === stockId.toString()
            );
          },
        );
      }),
    );
  }

  findOneById(entityId: string): Observable<InventoryMovementMongoModel> {
    return this.inventoryMovementMongoRepository.findOneById(entityId);
  }
}
