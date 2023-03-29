import { Observable, tap } from 'rxjs';
import { StockDomainModel } from '../../domain/models';
import { GotStocksByProductDomainEvent } from '../../domain/events/publishers';
import { IStockDomainService } from '../../domain/services';

export class GetStocksByProductUseCase {
  constructor(
    private readonly stock$: IStockDomainService,
    private readonly gotStockByProductDomainEvent: GotStocksByProductDomainEvent,
  ) {}

  execute(productId: string): Observable<StockDomainModel[]> {
    return this.stock$.findAllByProductId(productId).pipe(
      tap((stocks: StockDomainModel[]) => {
        this.gotStockByProductDomainEvent.publish(stocks);
      }),
    );
  }
}
