import { Observable, tap } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';
import { GotProductInfoDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';

export class GetProductInfoUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly gotProductInfoDomainEvent: GotProductInfoDomainEvent,
  ) {}

  execute(productId: string): Observable<ProductDomainModel> {
    return this.product$.findOneById(productId).pipe(
      tap((product: ProductDomainModel) => {
        this.gotProductInfoDomainEvent.publish(product).subscribe();
      }),
    );
  }
}
