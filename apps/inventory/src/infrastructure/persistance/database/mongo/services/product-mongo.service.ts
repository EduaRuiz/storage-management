import { Observable } from 'rxjs';
import { ProductMongoModel } from '../models';
import { IProductDomainService } from 'apps/inventory/src/domain/services';
import { Injectable } from '@nestjs/common';
import { ProductMongoRepository } from '../repositories';

/**
 * Servicio de dominio de productos en MongoDB
 *
 * @export
 * @class ProductMongoService
 * @implements {IProductDomainService<ProductMongoModel>}
 */
@Injectable()
export class ProductMongoService
  implements IProductDomainService<ProductMongoModel>
{
  /**
   * Crea una instancia de ProductMongoService
   *
   * @param {ProductMongoRepository} productMongoRepository Repositorio de productos en MongoDB
   * @memberof ProductMongoService
   */
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}

  /**
   * Crear un producto
   *
   * @param {ProductMongoModel} entity Producto
   * @return {Observable<ProductMongoModel>} Observable de producto creado
   * @memberof ProductMongoService
   */
  create(entity: ProductMongoModel): Observable<ProductMongoModel> {
    return this.productMongoRepository.create(entity);
  }

  /**
   * Actualizar un producto
   *
   * @param {string} entityId Id de producto
   * @param {ProductMongoModel} entity Producto
   * @return {Observable<ProductMongoModel>} Observable de producto actualizado
   * @memberof ProductMongoService
   */
  update(
    entityId: string,
    entity: ProductMongoModel,
  ): Observable<ProductMongoModel> {
    return this.productMongoRepository.update(entityId, entity);
  }

  /**
   * Eliminar un producto
   *
   * @param {string} entityId Id de producto
   * @return {Observable<ProductMongoModel>} Observable de producto eliminado
   * @memberof ProductMongoService
   */
  delete(entityId: string): Observable<ProductMongoModel> {
    return this.productMongoRepository.delete(entityId);
  }

  /**
   * Buscar todos los productos
   *
   * @return  {Observable<ProductMongoModel[]>} Observable de productos
   * @memberof ProductMongoService
   */
  findAll(): Observable<ProductMongoModel[]> {
    return this.productMongoRepository.findAll();
  }

  /**
   * Buscar un producto por id
   *
   * @param {string} entityId Id de producto
   * @return {Observable<ProductMongoModel>} Observable de producto
   * @memberof ProductMongoService
   */
  findOneById(entityId: string): Observable<ProductMongoModel> {
    return this.productMongoRepository.findOneById(entityId);
  }
}
