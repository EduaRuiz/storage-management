import { Observable } from 'rxjs/internal/Observable';
import { IStockEventFromStorageDomain } from '../../domain/interfaces';
import { ProductDomainModel, StockDomainModel } from '../../domain/models';
import {
  IProductDomainService,
  IStockDomainService,
} from '../../domain/services';
import { catchError, iif, mergeMap, of, switchMap } from 'rxjs';

/**
 * Maneja los eventos de stock
 *
 * @export
 * @class StockStorageEventManagerUseCase
 */
export class StockStorageEventManagerUseCase {
  /**
   * Crea una instancia de StockStorageEventManagerUseCase
   *
   * @param {IStockDomainService} stock$ Servicio de dominio de stocks
   * @param {IProductDomainService} product$ Servicio de dominio de productos
   * @memberof StockStorageEventManagerUseCase
   */
  constructor(
    private readonly stock$: IStockDomainService,
    private readonly product$: IProductDomainService,
  ) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {IStockEventFromStorageDomain} stockUpdated Evento de stock actualizado
   * @return  {Observable<StockDomainModel>} Observable con la información del stock
   * @memberof StockStorageEventManagerUseCase
   */
  execute(
    stockUpdated: IStockEventFromStorageDomain,
  ): Observable<StockDomainModel> {
    const stock = this.validateIfStockExists(
      stockUpdated.location._id,
      stockUpdated.productId,
    ).pipe(
      mergeMap((stock: boolean) => {
        return iif(
          () => stock,
          this.stock$.findByProductIdAndLocationId(
            stockUpdated.productId,
            stockUpdated.location._id,
          ),
          this.createStock(
            stockUpdated.productId,
            stockUpdated.location._id,
            stockUpdated.quantity,
          ),
        );
      }),
    );

    return stock.pipe(
      mergeMap((stock: StockDomainModel) => {
        return iif(
          () => stock.quantity === stockUpdated.quantity,
          of(stock),
          this.stock$.updateQuantity(stock._id, {
            _id: stock._id,
            product: stock.product,
            locationId: stock.locationId,
            quantity: stockUpdated.quantity,
            dateTime: stock.dateTime,
          }),
        );
      }),
    );
  }

  /**
   * Valida si el stock existe
   *
   * @private
   * @param {string} locationId Identificador de la ubicación
   * @param {string} productId Identificador del producto
   * @return   {Observable<boolean>} Observable con el resultado de la validación
   * @memberof StockStorageEventManagerUseCase
   */
  private validateIfStockExists(
    locationId: string,
    productId: string,
  ): Observable<boolean> {
    return this.stock$.findByProductIdAndLocationId(productId, locationId).pipe(
      catchError(() => {
        return of(false);
      }),
      switchMap((exist: boolean) => {
        return of(exist ? true : false);
      }),
    );
  }

  /**
   * Crea un stock
   *
   * @private
   * @param {string} productId Identificador del producto
   * @param {string} locationId Identificador de la ubicación
   * @param {number} quantity Cantidad
   * @return  {Observable<StockDomainModel>} Observable con la información del stock
   * @memberof StockStorageEventManagerUseCase
   */
  private createStock(
    productId: string,
    locationId: string,
    quantity: number,
  ): Observable<StockDomainModel> {
    return this.product$.findOneById(productId).pipe(
      catchError((error: Error) => {
        throw error;
      }),
      mergeMap((product: ProductDomainModel) => {
        return this.stock$.createStock({
          product,
          quantity,
          locationId,
          dateTime: new Date(),
        });
      }),
    );
  }
}
