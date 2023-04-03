import {
  IInventoryMovementDomainService,
  ILocationExistDomainService,
  IProductDomainService,
  IStockDomainService,
} from '@inventory/domain/services';
import { RegisterInventoryMovementUseCase } from '..';
import { RegisteredInventoryMovementDomainEvent } from '@inventory/domain/events/publishers';
import { IInventoryMovementDomainDto } from '@inventory/domain/dtos';
import { of } from 'rxjs';
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

    // it('should throw an error if location does not exist', (done) => {
    //   (locationExistService.exist as jest.Mock).mockRejectedValue(
    //     of(new Error('Location not found')),
    //   );
    //   (productService.findOneById as jest.Mock).mockReturnValue(
    //     of({ id: 'product-id' }),
    //   );
    //   (stockService.findByProductIdAndLocationId as jest.Mock).mockReturnValue(
    //     of(undefined),
    //   );
    //   (stockService.createStock as jest.Mock).mockReturnValue(of({}));
    //   (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

    //   const result$ = useCase.execute(inventoryMovementDto, token);
    //   result$.subscribe({
    //     error: (error) => {
    //       expect(error).toEqual(new Error('Location does not exist'));
    //       expect(locationExistService.exist).toHaveBeenCalledTimes(1);
    //       expect(locationExistService.exist).toHaveBeenCalledWith(
    //         'location-id',
    //         'token',
    //       );
    //       done();
    //     },
    //   });
    // });

    // it('should create a new stock', (done) => {
    //   inventoryMovementDto.typeMovement = 'OUT';
    //   (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
    //   (stockService.findByProductIdAndLocationId as jest.Mock).mockReturnValue(
    //     of(new NotFoundException('Stock not found')),
    //   );
    //   (productService.findOneById as jest.Mock)(
    //     stockService.findByProductIdAndLocationId as jest.Mock,
    //   ).mockRejectedValue(of(new NotFoundException('Stock not found')));
    //   (stockService.createStock as jest.Mock).mockReturnValue(of({}));
    //   (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

    //   const result$ = useCase.execute(inventoryMovementDto, token);
    //   result$.subscribe({
    //     next: (result) => {
    //       expect(result).toEqual({});
    //       expect(locationExistService.exist).toHaveBeenCalledTimes(1);
    //       expect(locationExistService.exist).toHaveBeenCalledWith(
    //         'location-id',
    //         'token',
    //       );
    //       expect(productService.findOneById).toHaveBeenCalledTimes(1);
    //       expect(productService.findOneById).toHaveBeenCalledWith(
    //         'product-id',
    //         'token',
    //       );
    //       expect(
    //         stockService.findByProductIdAndLocationId,
    //       ).toHaveBeenCalledTimes(1);
    //       expect(
    //         stockService.findByProductIdAndLocationId,
    //       ).toHaveBeenCalledWith('product-id', 'location-id', 'token');
    //       expect(stockService.createStock).toHaveBeenCalledTimes(1);
    //       expect(inventoryMovementService.create).toHaveBeenCalledTimes(1);
    //       expect(inventoryMovementService.create).toHaveBeenCalledWith(
    //         {
    //           productId: 'product-id',
    //           locationId: 'location-id',
    //           quantity: 5,
    //           typeMovement: 'IN',
    //         },
    //         'token',
    //       );
    //       done();
    //     },
    //   });
    // });

    // it('should throw an error if product does not exist', (done) => {
    //   (locationExistService.exist as jest.Mock).mockReturnValue(of(true));
    //   (productService.findOneById as jest.Mock).mockReturnValue(
    //     of(new Error('Product does not exist')),
    //   );
    //   (
    //     stockService.findByProductIdAndLocationId as jest.Mock
    //   ).mockRejectedValue(of(new NotFoundException('Stock not found')));
    //   (stockService.createStock as jest.Mock).mockReturnValue(of({}));
    //   (inventoryMovementService.create as jest.Mock).mockReturnValue(of({}));

    //   const result$ = useCase.execute(inventoryMovementDto, token);
    //   result$.subscribe({
    //     error: (error) => {
    //       expect(error).toEqual(new Error('Product does not exist'));
    //       expect(locationExistService.exist).toHaveBeenCalledTimes(1);
    //       expect(locationExistService.exist).toHaveBeenCalledWith(
    //         'location-id',
    //         'token',
    //       );
    //       expect(productService.findOneById).toHaveBeenCalledTimes(1);
    //       expect(productService.findOneById).toHaveBeenCalledWith(
    //         'product-id',
    //         'token',
    //       );
    //       expect(
    //         stockService.findByProductIdAndLocationId,
    //       ).toHaveBeenCalledTimes(0);
    //       expect(stockService.createStock).toHaveBeenCalledTimes(0);
    //       expect(inventoryMovementService.create).toHaveBeenCalledTimes(0);
    //       done();
    //     },
    //   });
    // });

    // it('should update an existing stock', async () => {
    //   (locationExistService.locationExist as jest.Mock).mockReturnValue(
    //     of(true),
    //   );
    //   (productService.findById as jest.Mock).mockReturnValue(
    //     of({ id: 'product-id' }),
    //   );
    //   (stockService.findByProductIdAndLocationId as jest.Mock).mockReturnValue(
    //     of(new StockDomainModel('product-id', 'location-id', 10)),
    //   );
    //   (stockService.save as jest.Mock).mockReturnValue(of({}));
    //   (inventoryMovementService.save as jest.Mock).mockReturnValue(of({}));

    //   const result = await useCase.execute(inventoryMovementDto, token);

    //   expect(result).toEqual({});

    //   expect(locationExistService.locationExist).toHaveBeenCalledTimes(1);
    //   expect(locationExistService.locationExist).toHaveBeenCalledWith(
    //     'location-id',
    //   );

    //   expect(productService.findById).toHaveBeenCalledTimes(1);
    //   expect(productService.findById).toHaveBeenCalledWith('product-id');

    //   expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledTimes(
    //     1,
    //   );
    //   expect(stockService.findByProductIdAndLocationId).toHaveBeenCalledWith(
    //     'product-id',
    //     'location-id',
    //   );

    //   expect(stockService.save).toHaveBeenCalledTimes(1);
    //   expect(stockService.save).toHaveBeenCalledWith(
    //     new StockDomainModel('product-id', 'location-id', 15),
    //   );
    // });
  });
});
