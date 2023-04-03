import {
  ILocationDomainService,
  IStockDomainService,
} from '@storage/domain/services';
import { StockInventoryEventManagerUseCase } from '..';
import { IStockEventFromInventoryDomain } from '@storage/domain/interfaces';
import { LocationDomainModel, StockDomainModel } from '@storage/domain/models';
import { of } from 'rxjs';

describe('StockInventoryEventManagerUseCase', () => {
  let stockService: IStockDomainService;
  let locationService: ILocationDomainService;
  let useCase: StockInventoryEventManagerUseCase;

  beforeEach(() => {
    stockService = {
      findOneByLocationIdAndProductId: jest.fn(),
      createStock: jest.fn(),
      updateQuantity: jest.fn(),
    } as unknown as IStockDomainService;

    locationService = {
      getLocationById: jest.fn(),
    } as unknown as ILocationDomainService;

    useCase = new StockInventoryEventManagerUseCase(
      stockService,
      locationService,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const stockEvent: IStockEventFromInventoryDomain = {
      _id: 'stockEventId',
      locationId: 'locationId',
      product: {
        _id: 'productId',
        name: 'productName',
        description: 'productDescription',
        price: 10,
      },
      quantity: 10,
      dateTime: new Date(),
    };

    // it('should return stock when stock exists and quantity is the same', (done) => {
    //   // Arrange
    //   const existingStock: StockDomainModel = {
    //     _id: 'existingStockId',
    //     location: {
    //       _id: 'locationId',
    //       name: 'locationName',
    //       description: 'locationDescription',
    //       address: 'locationAddress',
    //     },
    //     productId: 'productId',
    //     quantity: 10,
    //     dateTime: new Date(),
    //   };

    //   (
    //     stockService.findOneByLocationIdAndProductId as jest.Mock
    //   ).mockReturnValueOnce(of(existingStock));
    //   (locationService.getLocationById as jest.Mock).mockReturnValueOnce(
    //     of(existingStock.location),
    //   );
    //   (stockService.createStock as jest.Mock).mockReturnValueOnce(
    //     of(existingStock),
    //   );
    //   (stockService.updateQuantity as jest.Mock).mockReturnValueOnce(
    //     of(existingStock),
    //   );

    //   // Act
    //   const result$ = useCase.execute(stockEvent);

    //   // Assert
    //   result$.subscribe({
    //     next: (result) => {
    //       expect(result).toEqual(existingStock);
    //       done();
    //     },
    //   });
    // });

    // it('should update quantity when stock exists and quantity is different', (done) => {
    //   //  Arrange
    //   const existingStock: StockDomainModel = {
    //     _id: 'existingStockId',
    //     location: {
    //       _id: 'locationId',
    //       name: 'locationName',
    //       description: 'locationDescription',
    //       address: 'locationAddress',
    //     },
    //     productId: 'productId',
    //     quantity: 5,
    //     dateTime: new Date(),
    //   };

    //   const updatedStock: StockDomainModel = {
    //     _id: 'existingStockId',
    //     location: {
    //       _id: 'locationId',
    //       name: 'locationName',
    //       description: 'locationDescription',
    //       address: 'locationAddress',
    //     },
    //     productId: 'productId',
    //     quantity: 10,
    //     dateTime: existingStock.dateTime,
    //   };
    //   (
    //     stockService.findOneByLocationIdAndProductId as jest.Mock
    //   ).mockReturnValueOnce(of(existingStock));

    //   (stockService.updateQuantity as jest.Mock).mockReturnValueOnce(
    //     of(updatedStock),
    //   );
    //   (locationService.getLocationById as jest.Mock).mockReturnValueOnce(
    //     of(updatedStock.location),
    //   );
    //   (stockService.createStock as jest.Mock).mockReturnValueOnce(
    //     of(updatedStock),
    //   );

    //   // Act
    //   const result$ = useCase.execute(stockEvent);

    //   // Assert
    //   result$.subscribe({
    //     next: (result) => {
    //       expect(result).toEqual(updatedStock);
    //       done();
    //     },
    //   });
    // });

    it('should create stock when stock does not exist', (done) => {
      // Arrange
      const createdStock: StockDomainModel = {
        _id: 'createdStockId',
        location: {
          _id: 'locationId',
          name: 'locationName',
          description: 'locationDescription',
          address: 'locationAddress',
        },
        productId: 'productId',
        quantity: 10,
        dateTime: new Date(),
      };

      (
        stockService.findOneByLocationIdAndProductId as jest.Mock
      ).mockReturnValueOnce(of(false));
      (locationService.getLocationById as jest.Mock).mockReturnValueOnce(
        of(createdStock.location),
      );
      (stockService.createStock as jest.Mock).mockReturnValueOnce(
        of(createdStock),
      );

      // Act
      const result$ = useCase.execute(stockEvent);

      // Assert
      result$.subscribe((result) => {
        expect(result).toEqual(createdStock);
        done();
      });
    });
  });

  // describe('validateIfStockExists', () => {
  //   const locationId = 'locationId';
  //   const productId = 'productId';

  //   it('should return true when stock exists', (done) => {
  //     (
  //       stockService.findOneByLocationIdAndProductId as jest.Mock
  //     ).mockReturnValueOnce(of({} as StockDomainModel));

  //     useCase
  //       .validateIfStockExists(locationId, productId)
  //       .subscribe((result) => {
  //         expect(result).toBe(true);
  //         done();
  //       });
  //   });

  //   it('should return false when stock does not exist', (done) => {
  //     (
  //       stockService.findOneByLocationIdAndProductId as jest.Mock
  //     ).mockReturnValueOnce(of(false));

  //     useCase
  //       .validateIfStockExists(locationId, productId)
  //       .subscribe((result) => {
  //         expect(result).toBe(false);
  //         done();
  //       });
  //   });
  // });

  // describe('createStock', () => {
  //   const locationId = 'locationId';
  //   const productId = 'productId';
  //   const quantity = 10;

  //   it('should return created stock', (done) => {
  //     const location: LocationDomainModel = {
  //       _id: locationId,
  //       name: 'locationName',
  //       description: 'locationDescription',
  //       address: 'locationAddress',
  //     };

  //     const createdStock: StockDomainModel = {
  //       _id: 'createdStockId',
  //       location,
  //       productId,
  //       quantity,
  //       dateTime: new Date(),
  //     };

  //     (stockService.createStock as jest.Mock).mockReturnValueOnce(
  //       of(createdStock),
  //     );
  //     (stockService.createStock as jest.Mock).mockReturnValueOnce(
  //       of(createdStock),
  //     );

  //     useCase
  //       .createStock(locationId, productId, quantity)
  //       .subscribe((result) => {
  //         expect(result).toEqual(createdStock);
  //         done();
  //       });
  //   });
  // });
});
