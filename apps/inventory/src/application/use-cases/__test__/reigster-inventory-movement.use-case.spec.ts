import {
  IInventoryMovementDomainService,
  ILocationExistDomainService,
  IProductDomainService,
  IStockDomainService,
} from '@inventory/domain/services';
import { RegisterInventoryMovementUseCase } from '..';
import { RegisteredInventoryMovementDomainEvent } from '@inventory/domain/events/publishers';
import { IInventoryMovementDomainDto } from '@inventory/domain/dtos';
import { of, throwError } from 'rxjs';
import { StockDomainModel } from '@inventory/domain/models';
import { NotFoundException } from '@nestjs/common';

describe('RegisterInventoryMovementUseCase', () => {
  let useCase: RegisterInventoryMovementUseCase;
  let inventoryMovementService: IInventoryMovementDomainService;
  let stockService: IStockDomainService;
  let productService: IProductDomainService;
  let locationExistService: ILocationExistDomainService;
  let registeredInventoryMovementDomainEvent: RegisteredInventoryMovementDomainEvent;

  const inventoryMovementDto: IInventoryMovementDomainDto = {
    productId: 'product-id',
    locationId: 'location-id',
    quantity: 5,
    typeMovement: 'IN',
  };

  const token = 'token';

  beforeEach(() => {
    inventoryMovementService = {
      create: jest.fn(),
    } as unknown as IInventoryMovementDomainService;

    stockService = {
      findByProductIdAndLocationId: jest.fn(),
      createStock: jest.fn(),
    } as unknown as IStockDomainService;

    productService = {
      findOneById: jest.fn(),
    } as unknown as IProductDomainService;

    locationExistService = {
      exist: jest.fn(),
    } as unknown as ILocationExistDomainService;

    registeredInventoryMovementDomainEvent = {
      publish: jest.fn(),
    } as unknown as RegisteredInventoryMovementDomainEvent;

    useCase = new RegisterInventoryMovementUseCase(
      inventoryMovementService,
      stockService,
      productService,
      locationExistService,
      registeredInventoryMovementDomainEvent,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should register a new inventory movement', (done) => {
      const expectedStock = {
        _id: 'stock-id',
        product: { id: 'product-id' } as any,
        locationId: 'location-id',
        quantity: 5,
      } as StockDomainModel;

      (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
      (stockService.findByProductIdAndLocationId as jest.Mock).mockReturnValue(
        of(expectedStock),
      );
      (productService.findOneById as jest.Mock).mockReturnValue(
        of({ id: 'product-id' }),
      );
      (stockService.createStock as jest.Mock).mockReturnValue(of({}));
      (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

      const result$ = useCase.execute(inventoryMovementDto, token);
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({});
          expect(locationExistService.exist).toHaveBeenCalledTimes(1);
          expect(locationExistService.exist).toHaveBeenCalledWith(
            'location-id',
            'token',
          );
          expect(productService.findOneById).toHaveBeenCalledTimes(0);
          done();
        },
      });
    });

    it('should throw an error if location does not exist', (done) => {
      // Arrange
      jest
        .spyOn(locationExistService, 'exist')
        .mockReturnValue(throwError(new Error('Location not found')));

      // Act
      const result$ = useCase.execute(inventoryMovementDto, token);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(locationExistService.exist).toHaveBeenCalledTimes(1);
          expect(locationExistService.exist).toHaveBeenCalledWith(
            'location-id',
            'token',
          );
          done();
        },
      });
    });

    it('should create a new stock', (done) => {
      inventoryMovementDto.typeMovement = 'OUT';
      (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
      (stockService.findByProductIdAndLocationId as jest.Mock).mockReturnValue(
        of(new NotFoundException('Stock not found')),
      );
      jest
        .spyOn(productService, 'findOneById')
        .mockReturnValue(
          throwError(new NotFoundException('Product not found')),
        );
      (stockService.createStock as jest.Mock).mockReturnValue(of({}));
      (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

      const result$ = useCase.execute(inventoryMovementDto, token);
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({});
          expect(locationExistService.exist).toHaveBeenCalledTimes(1);
          expect(locationExistService.exist).toHaveBeenCalledWith(
            'location-id',
            'token',
          );
          expect(
            stockService.findByProductIdAndLocationId,
          ).toHaveBeenCalledTimes(1);
          expect(
            stockService.findByProductIdAndLocationId,
          ).toHaveBeenCalledWith('product-id', 'location-id');
          expect(inventoryMovementService.create).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    it('should throw an error if product does not exist', (done) => {
      (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
      jest
        .spyOn(stockService, 'findByProductIdAndLocationId')
        .mockReturnValue(throwError(new NotFoundException('Stock not found')));

      jest
        .spyOn(productService, 'findOneById')
        .mockReturnValue(
          throwError(new NotFoundException('Product not found')),
        );
      (stockService.createStock as jest.Mock).mockReturnValue(of({}));
      (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

      const result$ = useCase.execute(inventoryMovementDto, token);
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(locationExistService.exist).toHaveBeenCalledTimes(1);
          expect(locationExistService.exist).toHaveBeenCalledWith(
            'location-id',
            'token',
          );
          expect(productService.findOneById).toHaveBeenCalledTimes(1);
          expect(stockService.createStock).toHaveBeenCalledTimes(0);
          expect(inventoryMovementService.create).toHaveBeenCalledTimes(0);
          done();
        },
      });
    });

    it('should throw an error if product does not exist', (done) => {
      // Arrange
      inventoryMovementDto.typeMovement = 'IN';
      (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
      jest
        .spyOn(stockService, 'findByProductIdAndLocationId')
        .mockReturnValue(throwError(new NotFoundException('Stock not found')));

      (productService.findOneById as jest.Mock).mockReturnValue(
        throwError(new NotFoundException('Product not found')),
      );
      (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

      // Act
      const result$ = useCase.execute(inventoryMovementDto, token);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(locationExistService.exist).toHaveBeenCalledTimes(1);
          expect(locationExistService.exist).toHaveBeenCalledWith(
            'location-id',
            'token',
          );
          done();
        },
      });
    });

    it('should create a new stock', (done) => {
      // Arrange
      inventoryMovementDto.typeMovement = 'IN';
      (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
      jest
        .spyOn(stockService, 'findByProductIdAndLocationId')
        .mockReturnValue(throwError(new NotFoundException('Stock not found')));

      (productService.findOneById as jest.Mock).mockReturnValue(
        of({ id: 'product-id' }),
      );
      (stockService.createStock as jest.Mock).mockReturnValue(of({}));
      (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

      // Act
      const result$ = useCase.execute(inventoryMovementDto, token);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({});
          expect(locationExistService.exist).toHaveBeenCalledTimes(1);
          expect(locationExistService.exist).toHaveBeenCalledWith(
            'location-id',
            'token',
          );
          expect(
            stockService.findByProductIdAndLocationId,
          ).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });
});
