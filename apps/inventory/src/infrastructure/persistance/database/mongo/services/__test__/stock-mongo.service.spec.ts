import { Test, TestingModule } from '@nestjs/testing';
import { StockMongoService } from '..';
import { StockMongoModel, StockMongoRepository } from '../..';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('StockMongoService', () => {
  let service: StockMongoService;
  let repository: StockMongoRepository;

  const stock: StockMongoModel = {
    _id: '1',
    product: {
      _id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
    },
    dateTime: new Date(),
    locationId: '1',
    quantity: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockMongoService,
        {
          provide: StockMongoRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StockMongoService>(StockMongoService);
    repository = module.get<StockMongoRepository>(StockMongoRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findByProductIdAndLocationId', () => {
    it('should find a stock by product ID and location ID', (done) => {
      // Arrange
      jest.spyOn(repository, 'findAll').mockReturnValueOnce(of([stock]));

      // Act
      const result$ = service.findByProductIdAndLocationId(
        stock.product._id,
        stock.locationId,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(repository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw a NotFoundException if the stock is not found', (done) => {
      // Arrange
      jest.spyOn(repository, 'findAll').mockReturnValueOnce(of([]));

      // Act
      const result$ = service.findByProductIdAndLocationId(
        stock.product._id,
        stock.locationId,
      );

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(repository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('createStock', () => {
    it('should create a stock', (done) => {
      // Arrange
      jest.spyOn(repository, 'create').mockReturnValueOnce(of(stock));

      // Act
      const result$ = service.createStock(stock);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(repository.create).toHaveBeenCalledWith(stock);
          done();
        },
      });
    });
  });

  describe('updateQuantity', () => {
    it('should update the quantity of a stock', (done) => {
      // Arrange
      const newQuantity = 5;
      const updatedStock = { ...stock, quantity: newQuantity };
      jest.spyOn(repository, 'findOneById').mockReturnValueOnce(of(stock));
      jest.spyOn(repository, 'update').mockReturnValueOnce(of(updatedStock));

      // Act
      const result$ = service.updateQuantity(stock._id, updatedStock);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(updatedStock);
          expect(repository.findOneById).toHaveBeenCalledWith(stock._id);
          expect(repository.update).toHaveBeenCalledWith(
            stock._id,
            updatedStock,
          );
          done();
        },
      });
    });
  });

  describe('findAllByProductId', () => {
    it('should find all stocks by product ID', (done) => {
      // Arrange
      jest.spyOn(repository, 'findAll').mockReturnValueOnce(of([stock]));

      // Act
      const result$ = service.findAllByProductId(stock.product._id);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([stock]);
          expect(repository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('findAllByLocationId', () => {
    it('should find all stocks by location ID', (done) => {
      // Arrange
      jest.spyOn(repository, 'findAll').mockReturnValueOnce(of([stock]));

      // Act
      const result$ = service.findAllByLocationId(stock.locationId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([stock]);
          expect(repository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should find a stock by ID', (done) => {
      // Arrange
      jest.spyOn(repository, 'findOneById').mockReturnValueOnce(of(stock));

      // Act
      const result$ = service.findOneById(stock._id);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stock);
          expect(repository.findOneById).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
