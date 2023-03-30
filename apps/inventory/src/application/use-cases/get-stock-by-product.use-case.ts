import { Observable } from 'rxjs';
import { StockDomainModel } from '../../domain/models';
import { IStockDomainService } from '../../domain/services';

export class GetStocksByProductUseCase {
  constructor(private readonly stock$: IStockDomainService) {}

  execute(productId: string): Observable<StockDomainModel[]> {
    return this.stock$.findAllByProductId(productId).pipe();
  }
}
