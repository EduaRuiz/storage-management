import { IStockEventFromStorageDomain } from '@inventory/domain/interfaces';
import {
  IProductDomainService,
  IStockDomainService,
} from '@inventory/domain/services';
import { Observable, of } from 'rxjs';
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

    //   it('should update the stock quantity when the quantity is different from the updated quantity', (done) => {
    //     const findByProductIdAndLocationIdSpy = jest
    //       .spyOn(stock$, 'findByProductIdAndLocationId')
    //       .mockReturnValue(of(stock));
    //     const updateQuantitySpy = jest
    //       .spyOn(stock$, 'updateQuantity')
    //       .mockReturnValue(of(stock));
    //     jest.spyOn(product$, 'findOneById').mockReturnValue(of(product));
    //     jest.spyOn(stock$, 'createStock').mockReturnValue(of(stock));

    //     const result$: Observable<StockDomainModel> = useCase.execute({
    //       ...stockUpdated,
    //       quantity: 20,
    //     });

    //     expect(findByProductIdAndLocationIdSpy).toHaveBeenCalledWith(
    //       stockUpdated.productId,
    //       stockUpdated.location._id,
    //     );
    //     expect(updateQuantitySpy).toHaveBeenCalledWith(
    //       stock._id,
    //       stockUpdated.quantity,
    //     );
    //     result$.subscribe({
    //       next: (result) => {
    //         expect(result.quantity).toEqual(stockUpdated.quantity);
    //         done();
    //       },
    //     });
    //   });

    //   it('should create a new stock when the stock is not found', (done) => {
    //     const findByProductIdAndLocationIdSpy = jest
    //       .spyOn(stock$, 'findByProductIdAndLocationId')
    //       .mockRejectedValue(of(new Error()) as never);
    //     const createStockSpy = jest
    //       .spyOn(stock$, 'createStock')
    //       .mockReturnValue(of(stock));
    //     const findOneByIdSpy = jest
    //       .spyOn(product$, 'findOneById')
    //       .mockReturnValue(of(product));

    //     const result$: Observable<StockDomainModel> =
    //       useCase.execute(stockUpdated);

    //     expect(findByProductIdAndLocationIdSpy).toHaveBeenCalledWith(
    //       stockUpdated.productId,
    //       stockUpdated.location._id,
    //     );
    //     expect(createStockSpy).toHaveBeenCalledWith({
    //       locationId: stockUpdated.location._id,
    //       productId: stockUpdated.productId,
    //       quantity: stockUpdated.quantity,
    //     });
    //     expect(findOneByIdSpy).toHaveBeenCalledWith(stockUpdated.productId);
    //     result$.subscribe({
    //       next: (result) => {
    //         expect(result.product.name).toEqual(product.name);
    //         expect(result.quantity).toEqual(stockUpdated.quantity);
    //         done();
    //       },
    //     });
    //   });
  });
});
