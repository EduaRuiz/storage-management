import { Observable, map, switchMap, zip } from 'rxjs';
import {
  InventoryTransferMongoRepository,
  StockMongoRepository,
} from '../repositories';
import { InventoryTransferMongoModel } from '../models';
import { Injectable } from '@nestjs/common';
import { IInventoryTransferDomainService } from 'apps/storage-management/src/domain/services';

@Injectable()
export class InventoryTransferMongoService
  implements IInventoryTransferDomainService<InventoryTransferMongoModel>
{
  constructor(
    private readonly inventoryTransferMongoRepository: InventoryTransferMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}
  generateTransfer(
    entity: InventoryTransferMongoModel,
  ): Observable<InventoryTransferMongoModel> {
    entity.stockIn.quantity += entity.quantity;
    entity.stockOut.quantity -= entity.quantity;
    return this.inventoryTransferMongoRepository.create(entity).pipe(
      switchMap((inventoryTransfer: InventoryTransferMongoModel) => {
        const updateStockIn$ = this.stockMongoRepository.update(
          entity.stockIn._id,
          entity.stockIn,
        );
        const updateStockOut$ = this.stockMongoRepository.update(
          entity.stockOut._id,
          entity.stockOut,
        );
        return zip(updateStockIn$, updateStockOut$).pipe(
          map(() => inventoryTransfer),
        );
      }),
    );
  }

  getTransfersByProductId(
    productId: string,
  ): Observable<InventoryTransferMongoModel[]> {
    return this.inventoryTransferMongoRepository.findAll().pipe(
      map((entities: InventoryTransferMongoModel[]) => {
        return entities.filter(
          (entity: InventoryTransferMongoModel) =>
            entity.stockIn.productId === productId,
        );
      }),
    );
  }

  getTransfersByLocationId(
    locationId: string,
  ): Observable<InventoryTransferMongoModel[]> {
    return this.inventoryTransferMongoRepository.findAll().pipe(
      map((entities: InventoryTransferMongoModel[]) => {
        return entities.filter(
          (entity: InventoryTransferMongoModel) =>
            entity.stockIn.location._id === locationId ||
            entity.stockOut.location._id === locationId,
        );
      }),
    );
  }
}
