import { IProductDomainService } from '../../domain/services';
import { ProductDomainModel } from '../../domain/models';
import { Observable, tap } from 'rxjs';
import { RemovedProductDomainEvent } from '../../domain/events/publishers';

export class RemoveProductUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly removedProductPublisher: RemovedProductDomainEvent,
  ) {}

  execute(productId: string): Observable<ProductDomainModel> {
    return this.product$
      .delete(productId)
      .pipe(tap((product) => this.removedProductPublisher.publish(product)));
  }
}
