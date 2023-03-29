import { StockDomainModel } from '../../models';
import { Observable } from 'rxjs';

export abstract class GotStocksByProductDomainEvent<
  Response = StockDomainModel[],
> {
  abstract publish(stock: Response): Observable<Response>;
}
