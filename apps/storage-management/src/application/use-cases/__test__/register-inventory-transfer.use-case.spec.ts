import { of, throwError } from 'rxjs';
import { RegisterInventoryTransferUseCase } from '..';
import {
  IInventoryTransferDomainService,
  ILocationDomainService,
  IProductExistDomainService,
  IStockDomainService,
} from '@storage/domain/services';
import { RegisteredInventoryTransferDomainEvent } from '@storage/domain/events/publishers';
import { IInventoryTransferDomainDto } from '@storage/domain/dtos';
import {
  InventoryTransferDomainModel,
  LocationDomainModel,
  StockDomainModel,
} from '@storage/domain/models';
import { ProductDomainModel } from '@inventory/domain/models';
import { NotFoundException } from '@nestjs/common';

describe('RegisterInventoryTransferUseCase', () => {
  let registerInventoryTransferUseCase: RegisterInventoryTransferUseCase;
  let inventoryTransferService: IInventoryTransferDomainService;
  let stockService: IStockDomainService;
  let locationService: ILocationDomainService;
  let productExistService: IProductExistDomainService;
  let registeredInventoryTransferDomainEvent: RegisteredInventoryTransferDomainEvent;

  beforeEach(() => {
    inventoryTransferService = {
      generateTransfer: jest.fn(),
    } as unknown as IInventoryTransferDomainService;
    stockService = {
      findOneByLocationIdAndProductId: jest.fn(),
      createStock: jest.fn(),
    } as unknown as IStockDomainService;
    locationService = {
      getLocationById: jest.fn(),
    } as unknown as ILocationDomainService;
    productExistService = {
      exist: jest.fn(),
    } as unknown as IProductExistDomainService;
    registeredInventoryTransferDomainEvent = {
      publish: jest.fn(),
    } as unknown as RegisteredInventoryTransferDomainEvent;

    registerInventoryTransferUseCase = new RegisterInventoryTransferUseCase(
      inventoryTransferService,
      stockService,
      locationService,
      productExistService,
      registeredInventoryTransferDomainEvent,
    );
  });

  describe('execute', () => {
    let dto: IInventoryTransferDomainDto;
    let token: string;
    let locationIn: LocationDomainModel;
    let locationOut: LocationDomainModel;
    let product: ProductDomainModel;
    let stockIn: StockDomainModel;
    let stockOut: StockDomainModel;
    let transfer: InventoryTransferDomainModel;

    beforeEach(() => {
      dto = {
        locationInId: 'location-in-id',
        locationOutId: 'location-out-id',
        productId: 'product-id',
        quantity: 10,
      };
      token = 'token';

      locationIn = { id: 'location-in-id' } as unknown as LocationDomainModel;
      locationOut = { id: 'location-out-id' } as unknown as LocationDomainModel;
      product = { id: 'product-id' } as unknown as ProductDomainModel;
      stockIn = {
        id: 'stock-in-id',
        location: locationIn,
        productId: 'product-id',
        quantity: 20,
      } as unknown as StockDomainModel;
      stockOut = {
        id: 'stock-out-id',
        location: locationOut,
        productId: 'product-id',
        quantity: 30,
      } as unknown as StockDomainModel;
      transfer = {
        id: 'transfer-id',
      } as unknown as InventoryTransferDomainModel;
    });

    it('should be defined', () => {
      expect(registerInventoryTransferUseCase).toBeDefined();
    });

    describe('when product does not exist', () => {
      // Arrange
      beforeEach(() => {
        productExistService.exist = jest
          .fn()
          .mockReturnValue(throwError(new Error('Product not found')));
      });

      it('should throw NotFoundException', (done) => {
        // Act
        const result$ = registerInventoryTransferUseCase.execute(dto, token);

        // Assert
        result$.subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(NotFoundException);
            expect(err.message).toBe('Product not found');
            done();
          },
        });
      });
    });

    // describe('when product exists', () => {
    //   // Arrange
    //   beforeEach(() => {
    //     productExistService.exist = jest.fn().mockReturnValue(of(true));
    //   });

    //   describe('when location and stock are valid', () => {
    //     beforeEach(() => {
    //       locationService.getLocationById = jest
    //         .fn()
    //         .mockReturnValue(of(locationIn));
    //       stockService.findOneByLocationIdAndProductId = jest
    //         .fn()
    //         .mockReturnValueOnce(of(stockIn))
    //         .mockReturnValueOnce(of(stockOut));
    //       stockService.createStock = jest.fn().mockReturnValue(of(stockIn));
    //       inventoryTransferService.generateTransfer = jest
    //         .fn()
    //         .mockReturnValue(of(transfer));
    //       registeredInventoryTransferDomainEvent.publish = jest
    //         .fn()
    //         .mockReturnValue(of(true));
    //     });

    //     it('should create inventory transfer and return it', (done) => {
    //       // Act
    //       const result$ = registerInventoryTransferUseCase.execute(dto, token);

    //       console.log(
    //         result$.subscribe({
    //           next: (result) => {
    //             console.log(result);
    //           },
    //           error: (err) => {
    //             console.log(err);
    //           },
    //           complete: () => {
    //             console.log('complete');
    //           },
    //         }),
    //       );
    //       // Assert
    //       result$.subscribe({
    //         next: (result) => {
    //           expect(result).toEqual(transfer);
    //           expect(
    //             inventoryTransferService.generateTransfer,
    //           ).toHaveBeenCalledWith({
    //             dateTime: expect.any(Date),
    //             quantity: dto.quantity,
    //             stockIn,
    //             stockOut,
    //           });
    //           expect(
    //             registeredInventoryTransferDomainEvent.publish,
    //           ).toHaveBeenCalledWith({
    //             transfer,
    //             token,
    //           });
    //           done();
    //         },
    //       });
    //     });
    //   });
    // });
  });
});
