import { Observable } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';
import { IProductDomainService } from '../../domain/services';

export class GetProductInfoUseCase {
  constructor(private readonly product$: IProductDomainService) {}

  execute(productId: string): Observable<ProductDomainModel> {
    return this.product$.findOneById(productId).pipe();
  }
}
