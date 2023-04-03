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

      it('should not call inventoryTransferService.generateTransfer', (done) => {
        // Act
        const result$ = registerInventoryTransferUseCase.execute(dto, token);

        // Assert
        result$.subscribe({
          error: () => {
            expect(
              inventoryTransferService.generateTransfer,
            ).not.toHaveBeenCalled();
            done();
          },
        });
      });

      it('should validateLocationAndStock before call inventoryTransferService.generateTransfer', (done) => {
        // Arrange
        jest
          .spyOn(productExistService, 'exist')
          .mockReturnValue(of(true) as any);
        jest
          .spyOn(locationService, 'getLocationById')
          .mockReturnValue(of(locationIn) as any);
        jest
          .spyOn(stockService, 'findOneByLocationIdAndProductId')
          .mockReturnValue(of(stockIn) as any);

        jest
          .spyOn(inventoryTransferService, 'generateTransfer')
          .mockReturnValue(of(transfer) as any);
        jest
          .spyOn(stockService, 'createStock')
          .mockReturnValue(of(true) as any);

        jest
          .spyOn(registeredInventoryTransferDomainEvent, 'publish')
          .mockReturnValue(of(true) as any);

        // Act
        const result$ = registerInventoryTransferUseCase.execute(dto, token);

        // Assert
        result$.subscribe({
          next: () => {
            expect(locationService.getLocationById).toHaveBeenCalledWith(
              dto.locationInId,
            );
            done();
          },
        });
      });
    });
  });
});
