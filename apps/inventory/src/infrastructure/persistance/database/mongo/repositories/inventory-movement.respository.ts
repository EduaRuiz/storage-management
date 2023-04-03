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
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InventoryMovementMongoModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Repositorio de movimientos de inventario en MongoDB
 *
 * @export
 * @class InventoryMovementMongoRepository
 * @implements {IRepositoryBase<InventoryMovementMongoModel>}
 */
export class InventoryMovementMongoRepository
  implements IRepositoryBase<InventoryMovementMongoModel>
{
  /**
   * Crea una instancia de InventoryMovementMongoRepository
   *
   * @param {Model<InventoryMovementMongoModel>} inventoryMovementMongoModel Modelo de datos de movimiento de inventario para MongoDB
   * @memberof InventoryMovementMongoRepository
   */
  constructor(
    @InjectModel(InventoryMovementMongoModel.name)
    private inventoryMovementMongoModel: Model<InventoryMovementMongoModel>,
  ) {}

  /**
   * Crear un movimiento de inventario
   *
   * @param {InventoryMovementMongoModel} entity Movimiento de inventario
   * @return  {Observable<InventoryMovementMongoModel>} Observable de movimiento de inventario creado
   * @memberof InventoryMovementMongoRepository
   */
  create(
    entity: InventoryMovementMongoModel,
  ): Observable<InventoryMovementMongoModel> {
    return from(this.inventoryMovementMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(
          'Inventory movement create conflict',
          error.message,
        );
      }),
    );
  }

  /**
   * Actualizar un movimiento de inventario
   *
   * @param {string} entityId Identificador único del movimiento de inventario
   * @param {InventoryMovementMongoModel} entity Movimiento de inventario
   * @return  {Observable<InventoryMovementMongoModel>} Observable de movimiento de inventario actualizado
   * @memberof InventoryMovementMongoRepository
   */
  update(
    entityId: string,
    entity: InventoryMovementMongoModel,
  ): Observable<InventoryMovementMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return from(
          this.inventoryMovementMongoModel.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true, populate: 'stock' },
          ),
        ).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Inventory movement update conflict',
              error.message,
            );
          }),
        );
      }),
    );
  }

  /**
   * Eliminar un movimiento de inventario
   *
   * @param {string} entityId Identificador único del movimiento de inventario
   * @return  {Observable<InventoryMovementMongoModel>} Observable de movimiento de inventario eliminado
   * @memberof InventoryMovementMongoRepository
   */
  delete(entityId: string): Observable<InventoryMovementMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return this.inventoryMovementMongoModel.findByIdAndDelete({
          _id: entityId,
          new: true,
          populate: 'stock',
        });
      }),
    );
  }

  /**
   * Obtener todos los movimientos de inventario
   *
   * @return {Observable<InventoryMovementMongoModel[]>} Observable de lista de movimientos de inventario
   * @memberof InventoryMovementMongoRepository
   */
  findAll(): Observable<InventoryMovementMongoModel[]> {
    return from(
      this.inventoryMovementMongoModel
        .find()
        .populate({
          path: 'stock',
          populate: {
            path: 'product',
          },
        })
        .exec(),
    ).pipe(
      map((entities: InventoryMovementMongoModel[]) => {
        return entities;
      }),
    );
  }

  /**
   * Obtener un movimiento de inventario por su identificador único
   *
   * @param {string} entityId Identificador único del movimiento de inventario
   * @return {Observable<InventoryMovementMongoModel>} Observable de movimiento de inventario
   * @memberof InventoryMovementMongoRepository
   */
  findOneById(entityId: string): Observable<InventoryMovementMongoModel> {
    return from(
      this.inventoryMovementMongoModel.findById(
        { _id: entityId.toString() },
        {},
        { populate: 'stock' },
      ),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Inventory movement invalid ID format',
          error.message,
        );
      }),
      switchMap((product: InventoryMovementMongoModel) =>
        iif(
          () => product === null,
          throwError(
            () => new NotFoundException('Inventory movement not found'),
          ),
          of(product),
        ),
      ),
    );
  }
}
