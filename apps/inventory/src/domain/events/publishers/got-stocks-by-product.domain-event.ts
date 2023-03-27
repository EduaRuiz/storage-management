import { StockDomainEntity } from '../../entities';
import { Observable } from 'rxjs';

export abstract class GotStockByProductDomainEvent<
  Response = StockDomainEntity[],
> {
  abstract publish(stock: Response): Observable<Response>;
}
