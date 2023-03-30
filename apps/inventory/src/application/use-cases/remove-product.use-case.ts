import {
  IProductDomainService,
  IStockDomainService,
} from '../../domain/services';
import { ProductDomainModel, StockDomainModel } from '../../domain/models';
import { RemovedProductDomainEvent } from '../../domain/events/publishers';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export class RemoveProductUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly stock$: IStockDomainService,
    private readonly removedProductPublisher: RemovedProductDomainEvent,
  ) {}

  execute(productId: string): Observable<ProductDomainModel> {
    return this.checkStocks(productId).pipe(
      mergeMap(() => this.deleteProduct(productId)),
    );
  }

  private deleteProduct(productId: string): Observable<ProductDomainModel> {
    return this.product$.delete(productId).pipe(
      mergeMap((product) => {
        this.removedProductPublisher.publish(product).subscribe();
        return of(product);
      }),
    );
  }

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
