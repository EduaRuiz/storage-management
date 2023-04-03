import { ProductService } from '..';
import { ProductMongoService } from '../../database/mongo/services';

describe('ProductService', () => {
  let productService: ProductService;

  describe('when instantiated', () => {
    it('should extend ProductMongoService class', () => {
      productService = new ProductService({} as any);
      expect(productService).toBeInstanceOf(ProductMongoService);
    });
  });
});
