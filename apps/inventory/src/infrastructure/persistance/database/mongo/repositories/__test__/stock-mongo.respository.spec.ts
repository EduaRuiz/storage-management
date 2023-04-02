import { StockMongoRepository } from '..';
import { StockMongoModel } from '../../models';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

describe('StockMongoRepository', () => {
  let repository: StockMongoRepository;
  let model: Model<StockMongoModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockMongoRepository,
        {
          provide: getModelToken(StockMongoModel.name),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();
    repository = module.get<StockMongoRepository>(StockMongoRepository);
    model = module.get<Model<StockMongoModel>>(
      getModelToken(StockMongoModel.name),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new stock', (done) => {
      // Arrange
      const entity = {
        quantity: 5,
        locationId: '1',
        dateTime: new Date(),
        product: {} as any,
      } as StockMongoModel;
      const expectedEntity = { ...entity };
      jest.spyOn(model, 'create').mockResolvedValue(entity as any);

      // Act
      const result$ = repository.create(entity);

      // Assert
      result$.subscribe((result) => {
        expect(result).toEqual(expectedEntity);
        expect(model.create).toHaveBeenCalledWith(entity);
        done();
      });
    });

    it('should throw a ConflictException if there is a conflict', (done) => {
      // Arrange
      const entity = {} as StockMongoModel;
      const message = 'Stock create conflict';
      jest
        .spyOn(model, 'create')
        .mockRejectedValue(of(new ConflictException('Conflict')));

      // Act & Assert
      const result = repository.create(entity);
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toEqual(message);
          expect(model.create).toHaveBeenCalledWith(entity);
          done();
        },
      });
    });
  });

  describe('update', () => {
    let entityId: string;
    let entity: StockMongoModel;

    beforeEach(() => {
      entityId = '1';
      entity = {
        _id: entityId,
        quantity: 10,
        locationId: '1',
        dateTime: new Date(),
        product: {} as any,
      } as StockMongoModel;
    });

    it('should update an existing stock', (done) => {
      // Arrange
      const findOneByIdSpy = jest
        .spyOn(repository, 'findOneById')
        .mockReturnValue(of(entity));
      const expectedEntity = { ...entity, quantity: 10 };
      const findByIdAndUpdateSpy = jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockReturnValue(of(expectedEntity) as any);

      // Act
      const result$ = repository.update(entityId, {
        ...entity,
        quantity: 15,
      } as StockMongoModel);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedEntity);
          expect(findOneByIdSpy).toHaveBeenCalledWith(entityId);
          expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
            { _id: entityId },
            { ...entity, _id: entityId, quantity: 15 },
            { new: true, populate: 'product' },
          );
          done();
        },
      });
    });

    it('should throw a ConflictException if there is a conflict', (done) => {
      // Arrange
      const findOneByIdSpy = jest
        .spyOn(repository, 'findOneById')
        .mockReturnValue(of(entity));
      const message = 'Stock update conflict';
      const findByIdAndUpdateSpy = jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockRejectedValue(of(new ConflictException('Conflict')));

      // Act & Assert
      const result = repository.update(entityId, entity);
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toEqual(message);
          expect(findOneByIdSpy).toHaveBeenCalledWith(entityId);
          expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
            { _id: entityId },
            { ...entity, _id: entityId },
            { new: true, populate: 'product' },
          );
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete an stock by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const stock = {
        _id: entityId,
        name: 'Test Stock',
      } as any;
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(stock) as any);
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockReturnValueOnce(of(stock) as any);

      // Act
      const result$ = repository.delete(entityId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.findById).toHaveBeenCalledWith(
            { _id: entityId },
            {},
            { populate: 'product' },
          );
          expect(result).toEqual(stock);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of stocks', (done) => {
      // Arrange
      const stocks = [
        { _id: '1', name: 'Test Stock 1' },
        { _id: '2', name: 'Test Stock 2' },
      ];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(stocks),
      } as any);

      // Act
      const result$ = repository.findAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.find).toHaveBeenCalled();
          expect(result).toEqual(stocks);
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return an stock by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const stock = { _id: entityId, name: 'Test Stock' };
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(stock) as any);

      // Act
      const result = repository.findOneById(entityId);

      // Assert
      result.subscribe({
        next: (result) => {
          expect(model.findById).toHaveBeenCalledWith(
            { _id: entityId },
            {},
            { populate: 'product' },
          );
          expect(result).toEqual(stock);
          done();
        },
      });
    });

    it('should throw a BadRequestException if the ID is invalid', (done) => {
      // Arrange
      const entityId = 'invalidId';
      jest
        .spyOn(model, 'findById')
        .mockRejectedValue(of(new ConflictException('Conflict')));

      // Act
      const result$ = repository.findOneById(entityId);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(model.findById).toHaveBeenCalledWith(
            { _id: entityId },
            {},
            { populate: 'product' },
          );
          done();
        },
      });
    });

    it('should throw a NotFoundException if the stock is not found', (done) => {
      // Arrange
      const entityId = 'entityId';
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(null) as any);

      // Act
      const result$ = repository.findOneById(entityId);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(model.findById).toHaveBeenCalledWith(
            { _id: entityId },
            {},
            { populate: 'product' },
          );
          done();
        },
      });
    });
  });
});
