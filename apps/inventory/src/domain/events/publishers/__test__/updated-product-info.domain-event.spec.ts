import { Observable, of } from 'rxjs';
import { UpdatedProductInfoDomainEvent } from '..';
import { ProductDomainModel } from '../../../models';

class UpdatedProductInfoDomainEventImpl extends UpdatedProductInfoDomainEvent<ProductDomainModel> {
  publish(product: ProductDomainModel): Observable<ProductDomainModel> {
    return of(product);
  }
}

describe('UpdatedProductInfoDomainEvent', () => {
  let event: UpdatedProductInfoDomainEvent;
  let product: ProductDomainModel;
  let response$: Observable<ProductDomainModel>;

  beforeEach(() => {
    // Arrange
    product = {} as unknown as ProductDomainModel;
    event = new UpdatedProductInfoDomainEventImpl();
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
