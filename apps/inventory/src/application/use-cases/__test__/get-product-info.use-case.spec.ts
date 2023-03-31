import { IProductDomainService } from 'apps/inventory/src/domain';
import { of } from 'rxjs';
import { GetProductInfoUseCase } from '../get-product-info.use-case';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';

describe('GetProductInfoUseCase', () => {
  let product$: IProductDomainService;
  let getProductInfo: GetProductInfoUseCase;

  beforeEach(() => {
    product$ = {
      findOneById: jest.fn(),
    } as unknown as IProductDomainService;
    getProductInfo = new GetProductInfoUseCase(product$);
  });

  describe('execute', () => {
    it('should return an Observable of ProductDomainModel', (done) => {
      // Arrange
      const productId = 'test-product-id';
      const product: ProductDomainModel = {
        _id: productId,
        name: 'Test Product',
        description: 'A test product',
        price: 10.99,
      };
      jest.spyOn(product$, 'findOneById').mockReturnValue(of(product));

      // Act
      const result$ = getProductInfo.execute(productId);

      // Assert
      expect(product$.findOneById).toHaveBeenCalledWith(productId);
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(product);
          done();
        },
        error: done.fail,
      });
    });
  });
});
