import { Observable, map, switchMap, zip } from 'rxjs';
import {
  InventoryTransferMongoRepository,
  StockMongoRepository,
} from '../repositories';
import { InventoryTransferMongoModel } from '../models';
import { Injectable } from '@nestjs/common';
import { IInventoryTransferDomainService } from 'apps/storage-management/src/domain/services';

/**
 * Servicio de transferencia de inventario en MongoDB
 *
 * @export
 * @class InventoryTransferMongoService
 * @implements {IInventoryTransferDomainService<InventoryTransferMongoModel>}
 */
@Injectable()
export class InventoryTransferMongoService
  implements IInventoryTransferDomainService<InventoryTransferMongoModel>
{
  /**
   * Crea una instancia de InventoryTransferMongoService
   *
   * @param {InventoryTransferMongoRepository} inventoryTransferMongoRepository Repositorio de transferencia de inventario en MongoDB
   * @param {StockMongoRepository} stockMongoRepository Repositorio de stock en MongoDB
   * @memberof InventoryTransferMongoService
   */
  constructor(
    private readonly inventoryTransferMongoRepository: InventoryTransferMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}

  /**
   * Genera una transferencia de inventario
   *
   * @param {InventoryTransferMongoModel} entity Transferencia de inventario
   * @return {Observable<InventoryTransferMongoModel>} Observable de transferencia de inventario
   * @memberof InventoryTransferMongoService
   */
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

  /**
   * Obtiene transferencias de inventario por id de producto
   *
   * @param {string} productId Id de producto
   * @return {Observable<InventoryTransferMongoModel[]>} Observable de las transferencias de inventario
   * @memberof InventoryTransferMongoService
   */
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

  /**
   * Obtiene transferencias de inventario por id de ubicación
   *
   * @param {string} locationId Id de ubicación
   * @return {Observable<InventoryTransferMongoModel[]>} Observable de las transferencias de inventario
   * @memberof InventoryTransferMongoService
   */
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
