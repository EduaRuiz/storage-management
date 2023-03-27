import { Observable, tap } from 'rxjs';
import { ProductDomainEntity } from '../../domain/entities';
import { GotProductInfoDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';

export class GetProductInfoUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly gotProductInfoDomainEvent: GotProductInfoDomainEvent,
  ) {}

  execute(productId: string): Observable<ProductDomainEntity> {
    return this.product$.findOneById(productId).pipe(
      tap((product: ProductDomainEntity) => {
        this.gotProductInfoDomainEvent.publish(product);
      }),
    );
  }
}
