import {
  IProductDomainService,
  IStockDomainService,
} from '../../domain/services';
import { ProductDomainModel, StockDomainModel } from '../../domain/models';
import { RemovedProductDomainEvent } from '../../domain/events/publishers';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Elimina un producto
 *
 * @export
 * @class RemoveProductUseCase
 */
export class RemoveProductUseCase {
  /**
   * Crea una instancia de RemoveProductUseCase
   *
   * @param {IProductDomainService} product$ Servicio de dominio de productos
   * @param {IStockDomainService} stock$ Servicio de dominio de stocks
   * @param {RemovedProductDomainEvent} removedProductPublisher Publicador de eventos de producto eliminado
   * @memberof RemoveProductUseCase
   */
  constructor(
    private readonly product$: IProductDomainService,
    private readonly stock$: IStockDomainService,
    private readonly removedProductPublisher: RemovedProductDomainEvent,
  ) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {string} productId Identificador del producto
   * @return   {Observable<ProductDomainModel>} Observable con la información del producto eliminado
   * @memberof RemoveProductUseCase
   */
  execute(productId: string): Observable<ProductDomainModel> {
    return this.checkStocks(productId).pipe(
      mergeMap(() => this.deleteProduct(productId)),
    );
  }

  /**
   * Elimina un producto
   *
   * @private
   * @param {string} productId Identificador del producto
   * @return {Observable<ProductDomainModel>} Observable con la información del producto eliminado
   * @memberof RemoveProductUseCase
   */
  private deleteProduct(productId: string): Observable<ProductDomainModel> {
    return this.product$.delete(productId).pipe(
      mergeMap((product) => {
        this.removedProductPublisher.publish(product);
        return of(product);
      }),
    );
  }

  /**
   * Verifica si el producto tiene stocks
   *
   * @private
   * @param {string} productId Identificador del producto
   * @return  {Observable<void>} Observable vacío
   * @memberof RemoveProductUseCase
   */
  private checkStocks(productId: string): Observable<void> {
    return this.stock$
      .findAllByProductId(productId)
      .pipe(
        mergeMap((stocks: StockDomainModel[]) =>
          iif(
            () => stocks.length > 0,
            throwError(new ConflictException('Product has stocks')),
            of(null),
          ),
        ),
      );
  }
}
