import { InventoryMovementMongoRepository } from '..';
import { InventoryMovementMongoModel } from '../../models';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

describe('InventoryMovementMongoRepository', () => {
  let repository: InventoryMovementMongoRepository;
  let model: Model<InventoryMovementMongoModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryMovementMongoRepository,
        {
          provide: getModelToken(InventoryMovementMongoModel.name),
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
    repository = module.get<InventoryMovementMongoRepository>(
      InventoryMovementMongoRepository,
    );
    model = module.get<Model<InventoryMovementMongoModel>>(
      getModelToken(InventoryMovementMongoModel.name),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inventory movement', (done) => {
      // Arrange
      const entity = {
        quantity: 5,
        typeMovement: 'IN',
        dateTime: new Date(),
        stock: {} as any,
      } as InventoryMovementMongoModel;
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
      const entity = {} as InventoryMovementMongoModel;
      const message = 'Inventory movement create conflict';
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
    let entity: InventoryMovementMongoModel;

    beforeEach(() => {
      entityId = '1';
      entity = {
        _id: entityId,
        quantity: 10,
        typeMovement: 'OUT',
        dateTime: new Date(),
        stock: {} as any,
      } as InventoryMovementMongoModel;
    });

    it('should update an existing inventory movement', (done) => {
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
      } as InventoryMovementMongoModel);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedEntity);
          expect(findOneByIdSpy).toHaveBeenCalledWith(entityId);
          expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
            { _id: entityId },
            { ...entity, _id: entityId, quantity: 15 },
            { new: true, populate: 'stock' },
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
      const message = 'Inventory movement update conflict';
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
            { new: true, populate: 'stock' },
          );
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete an inventory movement by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const inventoryMovement = {
        _id: entityId,
        name: 'Test Movement',
      } as any;
      jest
        .spyOn(model, 'findById')
        .mockReturnValueOnce(of(inventoryMovement) as any);
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockReturnValue(of(inventoryMovement) as any);

      // Act
      const result$ = repository.delete(entityId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.findById).toHaveBeenCalledWith(
            { _id: entityId },
            {},
            { populate: 'stock' },
          );
          expect(result).toEqual(inventoryMovement);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of inventory movements', (done) => {
      // Arrange
      const inventoryMovements = [
        { _id: '1', name: 'Test Movement 1' },
        { _id: '2', name: 'Test Movement 2' },
      ];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(inventoryMovements),
      } as any);

      // Act
      const result$ = repository.findAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.find).toHaveBeenCalled();
          expect(result).toEqual(inventoryMovements);
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return an inventory movement by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const inventoryMovement = { _id: entityId, name: 'Test Movement' };
      jest
        .spyOn(model, 'findById')
        .mockReturnValueOnce(of(inventoryMovement) as any);

      // Act
      const result = repository.findOneById(entityId);

      // Assert
      result.subscribe({
        next: (result) => {
          expect(model.findById).toHaveBeenCalledWith(
            { _id: entityId },
            {},
            { populate: 'stock' },
          );
          expect(result).toEqual(inventoryMovement);
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
            { populate: 'stock' },
          );
          done();
        },
      });
    });

    it('should throw a NotFoundException if the inventory movement is not found', (done) => {
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
            { populate: 'stock' },
          );
          done();
        },
      });
    });
  });
});
