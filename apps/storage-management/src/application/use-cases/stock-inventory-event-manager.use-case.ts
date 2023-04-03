import { Observable } from 'rxjs/internal/Observable';
import { IStockEventFromInventoryDomain } from '../../domain/interfaces';
import { LocationDomainModel, StockDomainModel } from '../../domain/models';
import {
  ILocationDomainService,
  IStockDomainService,
} from '../../domain/services';
import { catchError, iif, mergeMap, of, switchMap } from 'rxjs';

/**
 * Caso de uso de administrar eventos de inventario
 *
 * @export
 * @class StockInventoryEventManagerUseCase
 */
export class StockInventoryEventManagerUseCase {
  /**
   * Crea una instancia de StockInventoryEventManagerUseCase
   *
   * @param {IStockDomainService} stock$ Servicio de dominio de stock
   * @param {ILocationDomainService} location$ Servicio de dominio de ubicación
   * @memberof StockInventoryEventManagerUseCase
   */
  constructor(
    private readonly stock$: IStockDomainService,
    private readonly location$: ILocationDomainService,
  ) {}

  /**
   * Ejecutar caso de uso
   *
   * @param {IStockEventFromInventoryDomain} stockOut Stock de inventario a administrar
   * @return {Observable<StockDomainModel>} Observable de stock
   * @memberof StockInventoryEventManagerUseCase
   */
  execute(
    stockOut: IStockEventFromInventoryDomain,
  ): Observable<StockDomainModel> {
    const stock = this.validateIfStockExists(
      stockOut.locationId,
      stockOut.product._id,
    ).pipe(
      mergeMap((stock: boolean) => {
        return iif(
          () => stock,
          this.stock$.findOneByLocationIdAndProductId(
            stockOut.locationId,
            stockOut.product._id,
          ),
          this.createStock(
            stockOut.locationId,
            stockOut.product._id,
            stockOut.quantity,
          ),
        );
      }),
    );

    return stock.pipe(
      mergeMap((stock: StockDomainModel) => {
        return iif(
          () => stock.quantity === stockOut.quantity,
          of(stock),
          this.stock$.updateQuantity(stock._id, {
            _id: stock._id,
            productId: stock.productId,
            location: stock.location,
            quantity: stockOut.quantity,
            dateTime: stock.dateTime,
          }),
        );
      }),
    );
  }

  /**
   * Validar si el stock existe
   *
   * @private
   * @param {string} locationId Id de ubicación
   * @param {string} productId Id de producto
   * @return {Observable<boolean>} Observable de booleano
   * @memberof StockInventoryEventManagerUseCase
   */
  private validateIfStockExists(
    locationId: string,
    productId: string,
  ): Observable<boolean> {
    return this.stock$
      .findOneByLocationIdAndProductId(locationId, productId)
      .pipe(
        catchError(() => {
          return of(false);
        }),
        switchMap((exist: boolean) => {
          return of(exist ? true : false);
        }),
      );
  }

  /**
   * Crear stock
   *
   * @private
   * @param {string} locationId Id de ubicación
   * @param {string} productId Id de producto
   * @param {number} quantity Cantidad
   * @return {Observable<StockDomainModel>} Observable de stock
   * @memberof StockInventoryEventManagerUseCase
   */
  private createStock(
    locationId: string,
    productId: string,
    quantity: number,
  ): Observable<StockDomainModel> {
    return this.location$.getLocationById(locationId).pipe(
      catchError((error: Error) => {
        throw error;
      }),
      mergeMap((location: LocationDomainModel) => {
        return this.stock$.createStock({
          location,
          quantity,
          productId,
          dateTime: new Date(),
        });
      }),
    );
  }
}
