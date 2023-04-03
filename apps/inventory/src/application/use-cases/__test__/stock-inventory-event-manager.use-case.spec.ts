import { IStockEventFromStorageDomain } from '@inventory/domain/interfaces';
import {
  IProductDomainService,
  IStockDomainService,
} from '@inventory/domain/services';
import { Observable, of, throwError } from 'rxjs';
import { StockStorageEventManagerUseCase } from '..';
import { ProductDomainModel, StockDomainModel } from '@inventory/domain/models';

describe('StockStorageEventManagerUseCase', () => {
  let stock$: IStockDomainService;
  let product$: IProductDomainService;
  let useCase: StockStorageEventManagerUseCase;
  let stockUpdated: IStockEventFromStorageDomain;
  let stock: StockDomainModel;
  let product: ProductDomainModel;

  beforeEach(() => {
    stock$ = {
      findByProductIdAndLocationId: jest.fn(),
      updateQuantity: jest.fn(),
      createStock: jest.fn(),
    } as unknown as IStockDomainService;
    product$ = {
      findOneById: jest.fn(),
    } as unknown as IProductDomainService;
    useCase = new StockStorageEventManagerUseCase(stock$, product$);
    stockUpdated = {
      _id: 'stock-updated-id',
      location: {
        _id: 'location-id',
        name: 'Location',
        description: 'Location description',
        address: 'Location address',
      },
      productId: 'product-id',
      quantity: 10,
      dateTime: new Date(),
    };
    stock = {
      _id: 'stock-id',
      locationId: 'location-id',
      product: {
        _id: 'product-id',
        name: 'Product',
        description: 'Product description',
        price: 10,
      },
      quantity: 5,
      dateTime: new Date(),
    };
    product = {
      _id: 'product-id',
      name: 'Product',
      description: 'Product description',
      price: 10,
    };
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return the stock when the quantity is the same as the updated quantity', (done) => {
      // Arrange
      const findByProductIdAndLocationIdSpy = jest
        .spyOn(stock$, 'findByProductIdAndLocationId')
        .mockReturnValue(of(stock));

      jest.spyOn(product$, 'findOneById').mockReturnValue(of(product));
      jest.spyOn(stock$, 'createStock').mockReturnValue(of(stock));
      jest.spyOn(stock$, 'updateQuantity').mockReturnValue(of(stock));

      // Act
      const result$: Observable<StockDomainModel> =
        useCase.execute(stockUpdated);

      // Assert
      expect(findByProductIdAndLocationIdSpy).toHaveBeenCalledWith(
        stockUpdated.productId,
        stockUpdated.location._id,
      );
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          done();
        },
      });
    });

    it('should validateIfStockExists when the quantity is the same as the updated quantity', (done) => {
      // Arrange
      jest
        .spyOn(stock$, 'findByProductIdAndLocationId')
        .mockReturnValue(throwError(new Error('Stock not found')));
      jest.spyOn(product$, 'findOneById').mockReturnValue(of(product));
      jest.spyOn(stock$, 'createStock').mockReturnValue(of(stock));
      jest.spyOn(stock$, 'updateQuantity').mockReturnValue(of(stock));

      // Act
      const result$: Observable<StockDomainModel> =
        useCase.execute(stockUpdated);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          done();
        },
      });
    });

    it('should createStock when product is not found', (done) => {
      // Arrange
      jest
        .spyOn(stock$, 'findByProductIdAndLocationId')
        .mockReturnValue(throwError(new Error('Stock not found')));
      jest
        .spyOn(product$, 'findOneById')
        .mockReturnValue(throwError(new Error('Product not found')));
      jest.spyOn(stock$, 'createStock').mockReturnValue(of(stock));
      jest.spyOn(stock$, 'updateQuantity').mockReturnValue(of(stock));

      // Act
      const result$: Observable<StockDomainModel> =
        useCase.execute(stockUpdated);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toEqual(new Error('Product not found'));
          done();
        },
      });
    });
  });
});
