import { Observable, of } from 'rxjs';
import { RemovedProductDomainEvent } from '..';
import { ProductDomainModel } from '../../../models';

class RemovedProductDomainEventImpl extends RemovedProductDomainEvent<ProductDomainModel> {
  publish(product: ProductDomainModel): Observable<ProductDomainModel> {
    return of(product);
  }
}

describe('RemovedProductDomainEvent', () => {
  let event: RemovedProductDomainEvent;
  let product: ProductDomainModel;
  let response$: Observable<ProductDomainModel>;

  beforeEach(() => {
    // Arrange
    product = {} as unknown as ProductDomainModel;
    event = new RemovedProductDomainEventImpl();
  });

  it('should publish new product', (done) => {
    // Act
    response$ = event.publish(product);

    // Assert
    response$.subscribe((response) => {
      expect(response).toBe(product);
      done();
    });
  });
});
