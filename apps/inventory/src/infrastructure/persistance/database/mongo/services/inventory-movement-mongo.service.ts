import { Observable, map, switchMap } from 'rxjs';
import {
  InventoryMovementMongoRepository,
  StockMongoRepository,
} from '../repositories';
import { InventoryMovementMongoModel } from '../models';
import { Injectable } from '@nestjs/common';
import { IInventoryMovementDomainService } from 'apps/inventory/src/domain/services';

/**
 * Servicio de dominio de movimientos de inventario en MongoDB
 *
 * @export
 * @class InventoryMovementMongoService
 * @implements {IInventoryMovementDomainService<InventoryMovementMongoModel>}
 */
@Injectable()
export class InventoryMovementMongoService
  implements IInventoryMovementDomainService<InventoryMovementMongoModel>
{
  /**
   * Crea una instancia de InventoryMovementMongoService
   *
   * @param {InventoryMovementMongoRepository} inventoryMovementMongoRepository Repositorio de movimientos de inventario en MongoDB
   * @param {StockMongoRepository} stockMongoRepository Repositorio de stock en MongoDB
   * @memberof InventoryMovementMongoService
   */
  constructor(
    private readonly inventoryMovementMongoRepository: InventoryMovementMongoRepository,
    private readonly stockMongoRepository: StockMongoRepository,
  ) {}

  /**
   * Buscar todos los movimientos de inventario por id de producto
   *
   * @param {string} productId Id de producto
   * @return {Observable<InventoryMovementMongoModel[]>} Observable de movimientos de inventario
   * @memberof InventoryMovementMongoService
   */
  findAllByProductId(
    productId: string,
  ): Observable<InventoryMovementMongoModel[]> {
    return this.inventoryMovementMongoRepository.findAll().pipe(
      map((inventoryMovements: InventoryMovementMongoModel[]) => {
        return inventoryMovements.filter(
          (inventoryMovement: InventoryMovementMongoModel) => {
            console.log(inventoryMovement);
            return (
              inventoryMovement.stock.product._id.toString() ===
              productId.toString()
            );
          },
        );
      }),
    );
  }

  /**
   * Crear un movimiento de inventario
   *
   * @param {InventoryMovementMongoModel} entity Movimiento de inventario
   * @return {Observable<InventoryMovementMongoModel>} Observable de movimiento de inventario creado
   * @memberof InventoryMovementMongoService
   */
  create(
    entity: InventoryMovementMongoModel,
  ): Observable<InventoryMovementMongoModel> {
    return this.inventoryMovementMongoRepository.create(entity).pipe(
      switchMap((inventoryMovement: InventoryMovementMongoModel) => {
        entity.typeMovement === 'IN'
          ? (entity.stock.quantity += entity.quantity)
          : (entity.stock.quantity -= entity.quantity);
        return this.stockMongoRepository
          .update(entity.stock._id, entity.stock)
          .pipe(map(() => inventoryMovement));
      }),
    );
  }

  /**
   * Buscar todos los movimientos de inventario por id de stock
   *
   * @param {string} stockId Id de stock
   * @return {Observable<InventoryMovementMongoModel[]>} Observable de movimientos de inventario
   * @memberof InventoryMovementMongoService
   */
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

  /**
   * Busca un movimiento de inventario por id
   *
   * @param {string} entityId Id de movimiento de inventario
   * @return {Observable<InventoryMovementMongoModel>} Observable de movimiento de inventario encontrado
   * @memberof InventoryMovementMongoService
   */
  findOneById(entityId: string): Observable<InventoryMovementMongoModel> {
    return this.inventoryMovementMongoRepository.findOneById(entityId);
  }
}
