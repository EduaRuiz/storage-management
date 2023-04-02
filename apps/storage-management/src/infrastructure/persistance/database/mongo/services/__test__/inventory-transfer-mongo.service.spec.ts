import { Test, TestingModule } from '@nestjs/testing';
import { InventoryTransferMongoService } from '..';
import {
  InventoryTransferMongoModel,
  InventoryTransferMongoRepository,
  StockMongoRepository,
} from '../..';
import { of } from 'rxjs';

describe('InventoryTransferMongoService', () => {
  let inventoryTransferMongoService: InventoryTransferMongoService;
  let inventoryTransferMongoRepository: InventoryTransferMongoRepository;
  let stockMongoRepository: StockMongoRepository;

  const stockIn = {
    _id: '1',
    quantity: 10,
    location: {
      _id: '1',
      name: 'Location 1',
      description: 'Description 1',
      address: 'Address 1',
    },
    productId: '1',
    dateTime: new Date(),
  };
  const stockOut = {
    _id: '2',
    quantity: 5,
    location: {
      _id: '2',
      name: 'Location 2',
      description: 'Description 2',
      address: 'Address 2',
    },
    productId: '1',
    dateTime: new Date(),
  };
  const inventoryTransfer: InventoryTransferMongoModel = {
    _id: '1',
    quantity: 3,
    stockIn,
    stockOut,
    dateTime: new Date(),
  };
  const productId = '1';
  const locationId = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryTransferMongoService,
        {
          provide: InventoryTransferMongoRepository,
          useValue: {
            create: jest.fn().mockReturnValue(of(inventoryTransfer)),
            findAll: jest.fn().mockReturnValue(of([inventoryTransfer])),
          },
        },
        {
          provide: StockMongoRepository,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    inventoryTransferMongoService = module.get<InventoryTransferMongoService>(
      InventoryTransferMongoService,
    );
    inventoryTransferMongoRepository =
      module.get<InventoryTransferMongoRepository>(
        InventoryTransferMongoRepository,
      );
    stockMongoRepository =
      module.get<StockMongoRepository>(StockMongoRepository);
  });

  describe('generateTransfer', () => {
    it('should generate a transfer and update stock quantities', (done) => {
      // Arrange
      jest.spyOn(stockMongoRepository, 'update').mockReturnValue(of(null));

      // Act
      const result$ =
        inventoryTransferMongoService.generateTransfer(inventoryTransfer);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(inventoryTransfer);
          expect(stockMongoRepository.update).toHaveBeenCalledTimes(2);
          expect(stockMongoRepository.update).toHaveBeenCalledWith(
            stockIn._id,
            stockIn,
          );
          expect(stockMongoRepository.update).toHaveBeenCalledWith(
            stockOut._id,
            stockOut,
          );
          done();
        },
      });
    });
  });

  describe('getTransfersByProductId', () => {
    it('should return transfers filtered by product id', (done) => {
      // Act
      const result$ =
        inventoryTransferMongoService.getTransfersByProductId(productId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([inventoryTransfer]);
          expect(
            inventoryTransferMongoRepository.findAll,
          ).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });

  describe('getTransfersByLocationId', () => {
    it('should return transfers filtered by location id', (done) => {
      // Act
      const result$ =
        inventoryTransferMongoService.getTransfersByLocationId(locationId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([inventoryTransfer]);
          expect(
            inventoryTransferMongoRepository.findAll,
          ).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });
});
