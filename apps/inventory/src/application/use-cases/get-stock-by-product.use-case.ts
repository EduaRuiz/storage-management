import { Observable } from 'rxjs';
import { StockDomainModel } from '../../domain/models';
import { IStockDomainService } from '../../domain/services';

/**
 * Retorna todos los stocks por producto
 *
 * @export
 * @class GetStocksByProductUseCase
 */
export class GetStocksByProductUseCase {
  /**
   * Crea una instancia de GetStocksByProductUseCase
   *
   * @param {IStockDomainService} stock$ Servicio de dominio de stocks
   * @memberof GetStocksByProductUseCase
   */
  constructor(private readonly stock$: IStockDomainService) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {string} productId Identificador del producto
   * @return {Observable<StockDomainModel[]>} Observable con los stocks
   * @memberof GetStocksByProductUseCase
   */
  execute(productId: string): Observable<StockDomainModel[]> {
    return this.stock$.findAllByProductId(productId).pipe();
  }
}
