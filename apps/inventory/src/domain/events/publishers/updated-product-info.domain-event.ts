import { ProductDomainModel } from '../../models';
import { Observable } from 'rxjs';

/**
 * Evento de dominio de actualización de información de producto
 *
 * @export
 * @abstract
 * @class UpdatedProductInfoDomainEvent
 * @template Response
 */
export abstract class UpdatedProductInfoDomainEvent<
  Response = ProductDomainModel,
> {
  /**
   * Publica el evento de dominio
   *
   * @abstract
   * @param {Response} product Producto
   * @return {Observable<Response>} Observable con el producto
   * @memberof UpdatedProductInfoDomainEvent
   */
  abstract publish(product: Response): Observable<Response>;
}
