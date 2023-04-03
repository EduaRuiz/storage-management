import { ProductDomainModel } from '../../models';
import { Observable } from 'rxjs';

/**
 * Evento de dominio de eliminación de producto
 *
 * @export
 * @abstract
 * @class RemovedProductDomainEvent
 * @template Response
 */
export abstract class RemovedProductDomainEvent<Response = ProductDomainModel> {
  /**
   * Publica el evento de dominio
   *
   * @abstract
   * @param {Response} product Producto
   * @return   {Observable<Response>} Observable con el producto
   * @memberof RemovedProductDomainEvent
   */
  abstract publish(product: Response): Observable<Response>;
}
