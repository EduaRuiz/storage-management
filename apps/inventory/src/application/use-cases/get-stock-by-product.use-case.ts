import { Observable, tap } from 'rxjs';
import { StockDomainEntity } from '../../domain/entities';
import { GotStocksByProductDomainEvent } from '../../domain/events/publishers';
import { IStockDomainService } from '../../domain/services';

export class GetStocksByProductUseCase {
  constructor(
    private readonly stock$: IStockDomainService,
    private readonly gotStockByProductDomainEvent: GotStocksByProductDomainEvent,
  ) {}

  execute(productId: string): Observable<StockDomainEntity[]> {
    return this.stock$.findAllByProductId(productId).pipe(
      tap((stocks: StockDomainEntity[]) => {
        this.gotStockByProductDomainEvent.publish(stocks);
      }),
    );
  }
}
