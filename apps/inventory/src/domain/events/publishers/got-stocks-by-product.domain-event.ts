import { StockDomainEntity } from '../../entities';
import { Observable } from 'rxjs';

export abstract class GotStocksByProductDomainEvent<
  Response = StockDomainEntity[],
> {
  abstract publish(stock: Response): Observable<Response>;
}
