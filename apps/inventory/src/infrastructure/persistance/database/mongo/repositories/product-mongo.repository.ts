import { IRepositoryBase } from './interfaces';
import {
  Observable,
  catchError,
  from,
  iif,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductMongoModel } from '../models';

/**
 * Repositorio de productos en MongoDB
 *
 * @export
 * @class ProductMongoRepository
 * @implements {IRepositoryBase<ProductMongoModel>}
 */
export class ProductMongoRepository
  implements IRepositoryBase<ProductMongoModel>
{
  /**
   * Crea una instancia de ProductMongoRepository
   *
   * @param {Model<ProductMongoModel>} productMongoModel Modelo de datos de producto para MongoDB
   * @memberof ProductMongoRepository
   */
  constructor(
    @InjectModel(ProductMongoModel.name)
    private productMongoModel: Model<ProductMongoModel>,
  ) {}

  /**
   * Crear un producto
   *
   * @param {ProductMongoModel} entity Producto
   * @return {Observable<ProductMongoModel>} Observable de producto creado
   * @memberof ProductMongoRepository
   */
  create(entity: ProductMongoModel): Observable<ProductMongoModel> {
    return from(this.productMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Product create conflict', error.message);
      }),
    );
  }

  /**
   * Actualizar un producto
   *
   * @param {string} entityId ID del producto
   * @param {ProductMongoModel} entity Producto
   * @return {Observable<ProductMongoModel>} Observable de producto actualizado
   * @memberof ProductMongoRepository
   */
  update(
    entityId: string,
    entity: ProductMongoModel,
  ): Observable<ProductMongoModel> {
    return this.findOneById(entityId).pipe(
      mergeMap(() => {
        return from(
          this.productMongoModel.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true },
          ),
        ).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Product update conflict',
              error.message,
            );
          }),
        );
      }),
    );
  }

  /**
   * Eliminar un producto
   *
   * @param {string} entityId ID del producto
   * @return {Observable<ProductMongoModel>} Observable de producto eliminado
   * @memberof ProductMongoRepository
   */
  delete(entityId: string): Observable<ProductMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return from(
          this.productMongoModel.findByIdAndDelete(
            { _id: entityId },
            { new: true },
          ),
        );
      }),
    );
  }

  /**
   * Obtener todos los productos
   *
   * @return {Observable<ProductMongoModel[]>} Observable de productos
   * @memberof ProductMongoRepository
   */
  findAll(): Observable<ProductMongoModel[]> {
    return from(this.productMongoModel.find().exec()).pipe(
      map((entities: ProductMongoModel[]) => {
        return entities;
      }),
    );
  }

  /**
   * Obtener un producto por su ID
   *
   * @param {string} entityId ID del producto
   * @return {Observable<ProductMongoModel>} Observable de producto
   * @memberof ProductMongoRepository
   */
  findOneById(entityId: string): Observable<ProductMongoModel> {
    return from(
      this.productMongoModel.findById({ _id: entityId.toString() }),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Product invalid ID format',
          error.message,
        );
      }),
      switchMap((product: ProductMongoModel) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Product not found')),
          of(product),
        ),
      ),
    );
  }
}
