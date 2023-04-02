import { ProductMongoRepository } from '..';
import { ProductMongoModel } from '../../models';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

describe('ProductMongoRepository', () => {
  let repository: ProductMongoRepository;
  let model: Model<ProductMongoModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductMongoRepository,
        {
          provide: getModelToken(ProductMongoModel.name),
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
    repository = module.get<ProductMongoRepository>(ProductMongoRepository);
    model = module.get<Model<ProductMongoModel>>(
      getModelToken(ProductMongoModel.name),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inventory movement', (done) => {
      // Arrange
      const entity = {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
      } as ProductMongoModel;
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
      const entity = {} as ProductMongoModel;
      const message = 'Product create conflict';
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
    let entity: ProductMongoModel;

    beforeEach(() => {
      entityId = '1';
      entity = {
        _id: entityId,
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
      } as ProductMongoModel;
    });

    it('should update an existing inventory movement', (done) => {
      // Arrange
      const findOneByIdSpy = jest
        .spyOn(repository, 'findOneById')
        .mockReturnValue(of(entity));
      const expectedEntity = { ...entity, price: 10 };
      const findByIdAndUpdateSpy = jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockReturnValue(of(expectedEntity) as any);

      // Act
      const result$ = repository.update(entityId, {
        ...entity,
        price: 15,
      } as ProductMongoModel);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedEntity);
          expect(findOneByIdSpy).toHaveBeenCalledWith(entityId);
          expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
            { _id: entityId },
            { ...entity, _id: entityId, price: 15 },
            { new: true },
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
      const message = 'Product update conflict';
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
            { new: true },
          );
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete an product by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const product = {
        _id: entityId,
        name: 'Test Product',
      } as any;
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(product) as any);
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockReturnValueOnce(of(product) as any);

      // Act
      const result$ = repository.delete(entityId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.findById).toHaveBeenCalledWith({ _id: entityId });
          expect(model.findByIdAndDelete).toHaveBeenCalledWith(
            { _id: entityId },
            { new: true },
          );
          expect(result).toEqual(product);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of inventory movements', (done) => {
      // Arrange
      const products = [
        { _id: '1', name: 'Test Product 1' },
        { _id: '2', name: 'Test Product 2' },
      ];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(products),
      } as any);

      // Act
      const result$ = repository.findAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.find).toHaveBeenCalled();
          expect(result).toEqual(products);
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return an product by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const product = { _id: entityId, name: 'Test Product' };
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(product) as any);

      // Act
      const result = repository.findOneById(entityId);

      // Assert
      result.subscribe({
        next: (result) => {
          expect(model.findById).toHaveBeenCalledWith({ _id: entityId });
          expect(result).toEqual(product);
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
          expect(model.findById).toHaveBeenCalledWith({ _id: entityId });
          done();
        },
      });
    });

    it('should throw a NotFoundException if the product is not found', (done) => {
      // Arrange
      const entityId = 'entityId';
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(null) as any);

      // Act
      const result$ = repository.findOneById(entityId);

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(model.findById).toHaveBeenCalledWith({ _id: entityId });
          done();
        },
      });
    });
  });
});
