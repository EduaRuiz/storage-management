import { of } from 'rxjs';
import { StockStorageEventManagerUseCase } from '..';
import {
  IProductDomainService,
  IStockDomainService,
} from 'apps/inventory/src/domain/services';
import {
  ILocationFromStorageDomain,
  IStockEventFromStorageDomain,
} from 'apps/inventory/src/domain/interfaces';
import {
  ProductDomainModel,
  StockDomainModel,
} from 'apps/inventory/src/domain/models';

jest.mock('../../domain/services');

describe('StockStorageEventManagerUseCase', () => {
  let stockService: IStockDomainService;
  let productService: IProductDomainService;
  let useCase: StockStorageEventManagerUseCase;

  beforeEach(() => {
    stockService = {
      findByProductIdAndLocationId: jest.fn(),
      createStock: jest.fn(),
      updateQuantity: jest.fn(),
    } as unknown as IStockDomainService;
    productService = {
      findOneById: jest.fn(),
    } as unknown as IProductDomainService;
    useCase = new StockStorageEventManagerUseCase(stockService, productService);
  });

  describe('execute', () => {
    const stockUpdated: IStockEventFromStorageDomain = {
      location: { _id: 'locationId' } as unknown as ILocationFromStorageDomain,
      productId: 'productId',
      quantity: 10,
      _id: '',
      dateTime: new Date(),
    };

    it('should return existing stock if it exists with the same quantity', async () => {
      const existingStock: StockDomainModel = {
        _id: 'stockId',
        quantity: 10,
      } as unknown as StockDomainModel;
      jest
        .spyOn(stockService, 'findByProductIdAndLocationId')
        .mockReturnValueOnce(of(existingStock));

      const result = await useCase.execute(stockUpdated).toPromise();

      expect(result).toEqual(existingStock);
      expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledWith(
        stockUpdated.productId,
        stockUpdated.location._id,
      );
      expect(stockService.updateQuantity).not.toHaveBeenCalled();
      expect(productService.findOneById).not.toHaveBeenCalled();
      expect(stockService.createStock).not.toHaveBeenCalled();
    });

    it('should update quantity of existing stock if it exists with a different quantity', async () => {
      const existingStock: StockDomainModel = {
        _id: 'stockId',
        quantity: 5,
      } as any;
      jest
        .spyOn(stockService, 'findByProductIdAndLocationId')
        .mockReturnValueOnce(of(existingStock));
      jest
        .spyOn(stockService, 'updateQuantity')
        .mockReturnValueOnce(of(existingStock));

      const result = await useCase.execute(stockUpdated).toPromise();

      expect(result).toEqual(existingStock);
      expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledWith(
        stockUpdated.productId,
        stockUpdated.location._id,
      );
      expect(stockService.updateQuantity).toHaveBeenCalledWith(
        existingStock._id,
        {
          quantity: stockUpdated.quantity,
        },
      );
      expect(productService.findOneById).not.toHaveBeenCalled();
      expect(stockService.createStock).not.toHaveBeenCalled();
    });

    it('should create new stock if it does not exist', async () => {
      const product: ProductDomainModel = { _id: 'productId' } as any;
      jest
        .spyOn(productService, 'findOneById')
        .mockReturnValueOnce(of(product));
      const newStock: StockDomainModel = {
        _id: 'stockId',
        quantity: 10,
      } as any;
      jest.spyOn(stockService, 'createStock').mockReturnValueOnce(of(newStock));

      const result = await useCase.execute(stockUpdated).toPromise();

      expect(result).toEqual(newStock);
      expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledWith(
        stockUpdated.productId,
        stockUpdated.location._id,
      );
      expect(productService.findOneById).toHaveBeenCalledWith(
        stockUpdated.productId,
      );
      expect(stockService.createStock).toHaveBeenCalledWith({
        product,
        locationId: stockUpdated.location._id,
        quantity: stockUpdated.quantity,
        dateTime: expect.any(Date),
      });
      expect(stockService.updateQuantity).not.toHaveBeenCalled();
    });
  });

  // describe('validateIfStockExists', () => {
  //   it('should return true if stock exists', async () => {
  //     jest
  //       .spyOn(stockService, 'findByProductIdAndLocationId')
  //       .mockReturnValueOnce(of(any));

  //     const result = await useCase
  //       .validateIfStockExists('locationId', 'productId')
  //       .toPromise();

  //     expect(result).toBe(true);
  //     expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledWith(
  //       'productId',
  //       'locationId',
  //     );
  //   });

  //   it('should return false if stock does not exist', async () => {
  //     stockService.findByProductIdAndLocationId.mockReturnValueOnce(
  //       new Observable((subscriber) => {
  //         subscriber.error(new Error('not found'));
  //       }),
  //     );

  //     const result = await useCase
  //       .validateIfStockExists('locationId', 'productId')
  //       .toPromise();

  //     expect(result).toBe(false);
  //     expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledWith(
  //       'productId',
  //       'locationId',
  //     );
  //   });
  // });

  // describe('createStock', () => {
  //   it('should create new stock', async () => {
  //     const product: ProductDomainModel = { _id: 'productId' } as any;
  //     productService.findOneById.mockReturnValueOnce(of(product));
});
