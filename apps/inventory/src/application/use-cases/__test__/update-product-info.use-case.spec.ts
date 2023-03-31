import { IProductDomainService } from 'apps/inventory/src/domain';
import { UpdatedProductInfoDomainEvent } from 'apps/inventory/src/domain/events';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';
import { of } from 'rxjs';
import { UpdateProductInfoUseCase } from '../update-product-info.use-case';
import { IUpdateProductDomainDto } from 'apps/inventory/src/domain/dtos';

describe('UpdateProductInfoUseCase', () => {
  let productService: IProductDomainService;
  let updatedProductInfoDomainEvent: UpdatedProductInfoDomainEvent<ProductDomainModel>;
  let useCase: UpdateProductInfoUseCase;

  beforeEach(() => {
    productService = {
      findOneById: jest.fn(),
      update: jest.fn(),
    } as unknown as IProductDomainService;
    updatedProductInfoDomainEvent = {
      publish: jest.fn().mockReturnValue(of(null)),
    } as unknown as UpdatedProductInfoDomainEvent<ProductDomainModel>;
    useCase = new UpdateProductInfoUseCase(
      productService,
      updatedProductInfoDomainEvent,
    );
  });

  describe('execute', () => {
    it('should update the product entity and publish an event', (done) => {
      // Arrange
      const productId = 'test-product-id';
      const updateProductDto: IUpdateProductDomainDto = {
        name: 'new-product-name',
        description: 'new-product-description',
        price: 99.99,
      };
      const product: ProductDomainModel = {
        _id: productId,
        name: 'test-product-name',
        description: 'test-product-description',
        price: 50.0,
      };
      jest.spyOn(productService, 'findOneById').mockReturnValue(of(product));
      jest
        .spyOn(productService, 'update')
        .mockReturnValue(of({ ...product, ...updateProductDto }));

      // Act
      const result$ = useCase.execute(productId, updateProductDto);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({ ...product, ...updateProductDto });
          done();
        },
        error: done.fail,
      });

      expect(productService.findOneById).toHaveBeenCalledWith(productId);
      expect(productService.update).toHaveBeenCalledWith(
        productId,
        expect.objectContaining({ ...product, ...updateProductDto }),
      );
      expect(updatedProductInfoDomainEvent.publish).toHaveBeenCalledWith({
        ...product,
        ...updateProductDto,
      });
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
      result$.subscribe((result) => {
        expect(result).toEqual({ ...product, ...updateProductDto });
      });
    });
  });
});
