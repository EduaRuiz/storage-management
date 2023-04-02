import { Test, TestingModule } from '@nestjs/testing';
import { StockMongoService } from '..';
import {
  LocationMongoRepository,
  StockMongoModel,
  StockMongoRepository,
} from '../..';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('StockMongoService', () => {
  let stockMongoService: StockMongoService;
  let stockMongoRepository: StockMongoRepository;

  const stock: StockMongoModel = {
    _id: '1',
    productId: '1',
    location: {
      _id: '1',
      name: 'Location 1',
      description: 'Description 1',
      address: '123 Main St',
    },
    quantity: 10,
    dateTime: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockMongoService,
        {
          provide: StockMongoRepository,
          useValue: {
            findAll: jest.fn().mockReturnValue(of([stock])),
            create: jest.fn().mockReturnValue(of(stock)),
            update: jest.fn().mockReturnValue(of(stock)),
            findOneById: jest.fn().mockReturnValue(of(stock)),
          },
        },
        {
          provide: LocationMongoRepository,
          useValue: {},
        },
      ],
    }).compile();

    stockMongoService = module.get<StockMongoService>(StockMongoService);
    stockMongoRepository =
      module.get<StockMongoRepository>(StockMongoRepository);
  });

  describe('findOneByLocationIdAndProductId', () => {
    it('should find stock by location id and product id', (done) => {
      // Arrange
      const locationId = '1';
      const productId = '1';

      // Act
      const result$ = stockMongoService.findOneByLocationIdAndProductId(
        locationId,
        productId,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(stockMongoRepository.findAll).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    it('should throw NotFoundException when stock not found', (done) => {
      // Arrange
      const locationId = '2';
      const productId = '2';

      // Act
      const result$ = stockMongoService.findOneByLocationIdAndProductId(
        locationId,
        productId,
      );

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(stockMongoRepository.findAll).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });

  describe('createStock', () => {
    it('should create stock', (done) => {
      // Arrange
      const entity: StockMongoModel = {
        productId: '2',
        location: {
          _id: '2',
          name: 'Location 2',
          description: 'Description 2',
          address: '456 Main St',
        },
        quantity: 20,
        dateTime: new Date(),
      };

      // Act
      const result$ = stockMongoService.createStock(entity);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(stockMongoRepository.create).toHaveBeenCalledTimes(1);
          expect(stockMongoRepository.create).toHaveBeenCalledWith(entity);
          done();
        },
      });
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity', (done) => {
      // Arrange
      const entityId = '1';
      const entity: StockMongoModel = {
        quantity: 5,
        location: {
          _id: '1',
          name: 'Location 1',
          description: 'Description 1',
          address: 'Address 1',
        },
        productId: '1',
        dateTime: new Date(),
      };

      // Act
      const result$ = stockMongoService.updateQuantity(entityId, entity);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(stockMongoRepository.findOneById).toHaveBeenCalledTimes(1);
          expect(stockMongoRepository.update).toHaveBeenCalledTimes(1);
          expect(stockMongoRepository.update).toHaveBeenCalledWith(
            entityId,
            stock,
          );
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should find stock by id', (done) => {
      // Arrange
      const entityId = '1';

      // Act
      const result$ = stockMongoService.findOneById(entityId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(stockMongoRepository.findOneById).toHaveBeenCalledTimes(1);
          expect(stockMongoRepository.findOneById).toHaveBeenCalledWith(
            entityId,
          );
          done();
        },
      });
    });
  });
});
