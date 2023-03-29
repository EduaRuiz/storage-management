import { Observable, map, tap } from 'rxjs';
import {
  InventoryTransferMongoRepository,
  StockMongoRepository,
} from '../repositories';
import { InventoryTransferMongoSchema } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IInventoryTransferDomainService } from 'apps/storage-management/src/domain/services';

@Injectable()
export class InventoryTransferMongoService
  implements IInventoryTransferDomainService<InventoryTransferMongoSchema>
{
  constructor(
    private readonly inventoryTransferMongoRepository: InventoryTransferMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}
  generateTransfer(
    entity: InventoryTransferMongoSchema,
  ): Observable<InventoryTransferMongoSchema> {
    entity.stockIn.quantity += entity.quantity;
    entity.stockOut.quantity -= entity.quantity;
    return this.inventoryTransferMongoRepository.create(entity).pipe(
      tap(() => {
        this.stockMongoRepository
          .update(entity.stockIn._id, entity.stockIn)
          .subscribe();
        this.stockMongoRepository
          .update(entity.stockOut._id, entity.stockOut)
          .subscribe();
      }),
    );
  }

  getTransfersByProductId(
    productId: string,
  ): Observable<InventoryTransferMongoSchema[]> {
    return this.inventoryTransferMongoRepository.findAll().pipe(
      map((entities: InventoryTransferMongoSchema[]) => {
        return entities.filter(
          (entity: InventoryTransferMongoSchema) =>
            entity.stockIn.productId === productId,
        );
      }),
    );
  }

  getTransfersByLocationId(
    locationId: string,
  ): Observable<InventoryTransferMongoSchema[]> {
    return this.inventoryTransferMongoRepository.findAll().pipe(
      map((entities: InventoryTransferMongoSchema[]) => {
        return entities.filter(
          (entity: InventoryTransferMongoSchema) =>
            entity.stockIn.location._id === locationId ||
            entity.stockOut.location._id === locationId,
        );
      }),
    );
  }
}
