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

/**
 * Repositorio de transferencia de inventario en MongoDB
 *
 * @export
 * @class InventoryTransferMongoRepository
 * @implements {IRepositoryBase<InventoryTransferMongoModel>}
 */
export class InventoryTransferMongoRepository
  implements IRepositoryBase<InventoryTransferMongoModel>
{
  /**
   * Crea una instancia de InventoryTransferMongoRepository
   *
   * @param {Model<InventoryTransferMongoModel>} inventoryTransferMongoEntity Modelo de transferencia de inventario en MongoDB
   * @memberof InventoryTransferMongoRepository
   */
  constructor(
    @InjectModel(InventoryTransferMongoModel.name)
    private inventoryTransferMongoEntity: Model<InventoryTransferMongoModel>,
  ) {}

  /**
   * Crea una transferencia de inventario
   *
   * @param {InventoryTransferMongoModel} entity Transferencia de inventario
   * @return {Observable<InventoryTransferMongoModel>} Observable de transferencia de inventario
   * @memberof InventoryTransferMongoRepository
   */
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

  /**
   * Actualiza una transferencia de inventario
   *
   * @param {string} entityId Identificador de la transferencia de inventario
   * @param {InventoryTransferMongoModel} entity Transferencia de inventario
   * @return {Observable<InventoryTransferMongoModel>} Observable de transferencia de inventario
   * @memberof InventoryTransferMongoRepository
   */
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

  /**
   * Elimina una transferencia de inventario
   *
   * @param {string} entityId Identificador de la transferencia de inventario
   * @return {Observable<InventoryTransferMongoModel>} Observable de transferencia de inventario
   * @memberof InventoryTransferMongoRepository
   */
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

  /**
   * Obtiene todas las transferencias de inventario
   *
   * @return {Observable<InventoryTransferMongoModel[]>} Observable de transferencias de inventario
   * @memberof InventoryTransferMongoRepository
   */
  findAll(): Observable<InventoryTransferMongoModel[]> {
    return from(this.inventoryTransferMongoEntity.find().exec()).pipe(
      map((entities: InventoryTransferMongoModel[]) => {
        return entities;
      }),
    );
  }

  /**
   * Obtiene una transferencia de inventario por su identificador
   *
   * @param {string} entityId Identificador de la transferencia de inventario
   * @return {Observable<InventoryTransferMongoModel>} Observable de transferencia de inventario
   * @memberof InventoryTransferMongoRepository
   */
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
