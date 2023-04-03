import { Observable } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';
import { IProductDomainService } from '../../domain/services';

/**
 * Retorna la información de un producto
 *
 * @export
 * @class GetProductInfoUseCase
 */
export class GetProductInfoUseCase {
  /**
   * Crea una instancia de GetProductInfoUseCase
   *
   * @param {IProductDomainService} product$ Servicio de dominio de productos
   * @memberof GetProductInfoUseCase
   */
  constructor(private readonly product$: IProductDomainService) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {string} productId Identificador del producto
   * @return {Observable<ProductDomainModel>} Observable con la información del producto
   * @memberof GetProductInfoUseCase
   */
  execute(productId: string): Observable<ProductDomainModel> {
    return this.product$.findOneById(productId).pipe();
  }
}
