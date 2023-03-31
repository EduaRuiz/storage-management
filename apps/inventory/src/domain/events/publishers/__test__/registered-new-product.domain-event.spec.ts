import { Observable, of } from 'rxjs';
import { RegisteredNewProductDomainEvent } from '..';
import { ProductDomainModel } from '../../../models';

class RegisteredNewProductDomainEventImpl extends RegisteredNewProductDomainEvent<ProductDomainModel> {
  publish(product: ProductDomainModel): Observable<ProductDomainModel> {
    return of(product);
  }
}

describe('RegisteredNewProductDomainEvent', () => {
  let event: RegisteredNewProductDomainEvent;
  let product: ProductDomainModel;
  let response$: Observable<ProductDomainModel>;

  beforeEach(() => {
    // Arrange
    product = {} as unknown as ProductDomainModel;
    event = new RegisteredNewProductDomainEventImpl();
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
