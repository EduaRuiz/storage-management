import { Observable } from 'rxjs/internal/Observable';
import { IStockEventFromStorageDomain } from '../../domain/interfaces';
import { ProductDomainModel, StockDomainModel } from '../../domain/models';
import {
  IProductDomainService,
  IStockDomainService,
} from '../../domain/services';
import { catchError, iif, mergeMap, of, switchMap } from 'rxjs';

export class StockStorageEventManagerUseCase {
  constructor(
    private readonly stock$: IStockDomainService,
    private readonly product$: IProductDomainService,
  ) {}

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
