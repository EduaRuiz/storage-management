import { Test, TestingModule } from '@nestjs/testing';
import { InventoryMovementMongoService } from '..';
import {
  InventoryMovementMongoModel,
  InventoryMovementMongoRepository,
  StockMongoRepository,
} from '../..';
import { of } from 'rxjs';

describe('InventoryMovementMongoService', () => {
  let service: InventoryMovementMongoService;
  let inventoryMovementMongoRepository: InventoryMovementMongoRepository;
  let stockMongoRepository: StockMongoRepository;
  let inventoryMovement: InventoryMovementMongoModel;
  let productId: string;
  let stockId: string;
  let entityId: string;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        InventoryMovementMongoService,
        {
          provide: InventoryMovementMongoRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOneById: jest.fn(),
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

    service = testingModule.get<InventoryMovementMongoService>(
      InventoryMovementMongoService,
    );
    inventoryMovementMongoRepository =
      testingModule.get<InventoryMovementMongoRepository>(
        InventoryMovementMongoRepository,
      );
    stockMongoRepository =
      testingModule.get<StockMongoRepository>(StockMongoRepository);

    inventoryMovement = {
      _id: '1',
      quantity: 10,
      typeMovement: 'IN',
      dateTime: new Date(),
      stock: {
        _id: '1',
        quantity: 10,
        locationId: '1',
        dateTime: new Date(),
        product: {
          _id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 10,
        },
      },
    };
    productId = '1';
    stockId = '1';
    entityId = '1';
  });

  afterAll(async () => {
    await testingModule.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('findAllByProductId', () => {
    it('should return inventory movements filtered by product id', (done) => {
      // Arrange
      jest
        .spyOn(inventoryMovementMongoRepository, 'findAll')
        .mockReturnValueOnce(of([inventoryMovement]));

      // Act
      const result$ = service.findAllByProductId(productId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([inventoryMovement]);
          expect(inventoryMovementMongoRepository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('create', () => {
    it('should create an inventory movement and update the stock quantity', (done) => {
      // Arrange
      jest
        .spyOn(inventoryMovementMongoRepository, 'create')
        .mockReturnValueOnce(of(inventoryMovement));
      jest.spyOn(stockMongoRepository, 'update').mockReturnValueOnce(of(null));

      // Act

      const result$ = service.create(inventoryMovement);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(inventoryMovement);
          expect(inventoryMovementMongoRepository.create).toHaveBeenCalled();
          expect(stockMongoRepository.update).toHaveBeenCalledWith(
            '1',
            inventoryMovement.stock,
          );
          done();
        },
      });
    });
  });

  describe('findAllByStockId', () => {
    it('should return inventory movements filtered by stock id', (done) => {
      // Arrange
      jest
        .spyOn(inventoryMovementMongoRepository, 'findAll')
        .mockReturnValueOnce(of([inventoryMovement]));

      // Act
      const result$ = service.findAllByStockId(stockId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([inventoryMovement]);
          expect(inventoryMovementMongoRepository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return an inventory movement by id', (done) => {
      // Arrange
      jest
        .spyOn(inventoryMovementMongoRepository, 'findOneById')
        .mockReturnValueOnce(of(inventoryMovement));

      // Act
      const result$ = service.findOneById(entityId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(inventoryMovement);
          expect(
            inventoryMovementMongoRepository.findOneById,
          ).toHaveBeenCalledWith(entityId);
          done();
        },
      });
    });
  });
});
