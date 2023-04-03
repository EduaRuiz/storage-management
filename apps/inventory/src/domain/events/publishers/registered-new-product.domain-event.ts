import { Observable } from 'rxjs';
import { ProductDomainModel } from '../../models';

/**
 * Evento de dominio de registro de nuevo producto
 *
 * @export
 * @abstract
 * @class RegisteredNewProductDomainEvent
 * @template Response
 */
export abstract class RegisteredNewProductDomainEvent<
  Response = ProductDomainModel,
> {
  /**
   * Publica el evento de dominio
   *
   * @abstract
   * @param {Response} product Producto
   * @return   {Observable<Response>} Observable con el producto
   * @memberof RegisteredNewProductDomainEvent
   */
  abstract publish(product: Response): Observable<Response>;
}
