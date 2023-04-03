import { Observable } from 'rxjs';
import { ProductDomainModel } from '../models';

/**
 * Servicio de dominio de productos
 *
 * @export
 * @interface IProductDomainService
 * @template Entity
 */
export interface IProductDomainService<
  Entity extends ProductDomainModel = ProductDomainModel,
> {
  /**
   * Crea un producto
   *
   * @param {Entity} entity Producto
   * @return  {Observable<Entity>} Observable con el producto
   * @memberof IProductDomainService
   */
  create(entity: Entity): Observable<Entity>;
  /**
   * Actualiza un producto
   *
   * @param {string} entityId Identificador del producto
   * @param {Entity} entity Producto
   * @return  {Observable<Entity>} Observable con el producto
   * @memberof IProductDomainService
   */
  update(entityId: string, entity: Entity): Observable<Entity>;
  /**
   * Elimina un producto
   *
   * @param {string} entityId Identificador del producto
   * @return  {Observable<Entity>} Observable con el producto
   * @memberof IProductDomainService
   */
  delete(entityId: string): Observable<Entity>;
  /**
   * Busca todos los productos
   *
   * @return  {Observable<Entity[]>} Observable con los productos
   * @memberof IProductDomainService
   */
  findAll(): Observable<Entity[]>;
  /**
   * Busca un producto por identificador
   *
   * @param {string} entityId Identificador del producto
   * @return {Observable<Entity>} Observable con el producto
   * @memberof IProductDomainService
   */
  findOneById(entityId: string): Observable<Entity>;
}
