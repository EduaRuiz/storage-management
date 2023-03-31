import { of, throwError } from 'rxjs';
import { ConflictException } from '@nestjs/common';
import {
  IProductDomainService,
  IStockDomainService,
} from 'apps/inventory/src/domain';
import { RemovedProductDomainEvent } from 'apps/inventory/src/domain/events';
import { RemoveProductUseCase } from '../remove-product.use-case';
import {
  ProductDomainModel,
  StockDomainModel,
} from 'apps/inventory/src/domain/models';

describe('RemoveProductUseCase', () => {
  let product$: IProductDomainService;
  let stock$: IStockDomainService;
  let removedProductPublisher: RemovedProductDomainEvent;
  let useCase: RemoveProductUseCase;

  beforeEach(() => {
    product$ = {
      delete: jest.fn(),
    } as unknown as IProductDomainService;
    stock$ = {
      findAllByProductId: jest.fn(),
    } as unknown as IStockDomainService;
    removedProductPublisher = {
      publish: jest.fn().mockReturnValue(of(null)),
    } as unknown as RemovedProductDomainEvent;
    useCase = new RemoveProductUseCase(
      product$,
      stock$,
      removedProductPublisher,
    );
  });

  describe('execute', () => {
    it('should remove the product entity and publish an event', (done) => {
      // Arrange
      const productId = 'test-product-id';
      jest.spyOn(stock$, 'findAllByProductId').mockReturnValue(of([]));
      jest
        .spyOn(product$, 'delete')
        .mockReturnValue(
          of({ _id: productId } as unknown as ProductDomainModel),
        );

      // Act
      const result$ = useCase.execute(productId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({ _id: productId });
          done();
        },
        error: done.fail,
      });

      expect(stock$.findAllByProductId).toHaveBeenCalledWith(productId);
      expect(product$.delete).toHaveBeenCalledWith(productId);
      expect(removedProductPublisher.publish).toHaveBeenCalledWith({
        _id: productId,
      });
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
      result$.subscribe((result) => {
        expect(result).toEqual({ _id: productId });
      });
    });

    it('should throw a ConflictException if product has stocks', (done) => {
      // Arrange
      const productId = 'test-product-id';
      const stocks: StockDomainModel[] = [
        {
          _id: 'test-stock-id',
          locationId: 'test-location-id',
          quantity: 5,
          dateTime: new Date(),
        },
      ];
      jest.spyOn(stock$, 'findAllByProductId').mockReturnValue(of(stocks));

      // Act
      const result$ = useCase.execute(productId);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          done();
        },
      });

      expect(stock$.findAllByProductId).toHaveBeenCalledWith(productId);
      expect(product$.delete).not.toHaveBeenCalled();
      expect(removedProductPublisher.publish).not.toHaveBeenCalled();
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
    });

    it('should propagate error from delete method', (done) => {
      // Arrange
      const productId = 'test-product-id';
      jest.spyOn(stock$, 'findAllByProductId').mockReturnValue(of([]));
      jest.spyOn(product$, 'delete').mockReturnValue(throwError('Error'));

      // Act
      const result$ = useCase.execute(productId);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toEqual('Error');
          done();
        },
      });

      expect(stock$.findAllByProductId).toHaveBeenCalledWith(productId);
      expect(product$.delete).toHaveBeenCalledWith(productId);
      expect(removedProductPublisher.publish).not.toHaveBeenCalled();
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
    });
  });
});
