import { InventoryTransferMongoRepository } from '..';
import { InventoryTransferMongoModel } from '../../models';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

describe('InventoryTransferMongoRepository', () => {
  let repository: InventoryTransferMongoRepository;
  let model: Model<InventoryTransferMongoModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryTransferMongoRepository,
        {
          provide: getModelToken(InventoryTransferMongoModel.name),
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
    repository = module.get<InventoryTransferMongoRepository>(
      InventoryTransferMongoRepository,
    );
    model = module.get<Model<InventoryTransferMongoModel>>(
      getModelToken(InventoryTransferMongoModel.name),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inventory transfer', (done) => {
      // Arrange
      const entity = {
        quantity: 5,
        stockIn: {} as any,
        stockOut: {} as any,
        dateTime: new Date(),
      } as InventoryTransferMongoModel;
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
      const entity = {} as InventoryTransferMongoModel;
      const message = 'Inventory transfer create conflict';
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
    let entity: InventoryTransferMongoModel;

    beforeEach(() => {
      entityId = '1';
      entity = {
        _id: entityId,
        quantity: 10,
        stockIn: {} as any,
        stockOut: {} as any,
        dateTime: new Date(),
      } as InventoryTransferMongoModel;
    });

    it('should update an existing inventory transfer', (done) => {
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
      } as InventoryTransferMongoModel);

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
      const message = 'Inventory transfer update conflict';
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
    it('should delete an inventory transfer by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const inventoryTransfer = {
        _id: entityId,
        name: 'Test Transfer',
      } as any;
      jest
        .spyOn(model, 'findById')
        .mockReturnValueOnce(of(inventoryTransfer) as any);
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockReturnValueOnce(of(inventoryTransfer) as any);

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
          expect(result).toEqual(inventoryTransfer);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of inventory transfers', (done) => {
      // Arrange
      const inventoryTransfers = [
        { _id: '1', name: 'Test Transfer 1' },
        { _id: '2', name: 'Test Transfer 2' },
      ];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(inventoryTransfers),
      } as any);

      // Act
      const result$ = repository.findAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(model.find).toHaveBeenCalled();
          expect(result).toEqual(inventoryTransfers);
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return an inventory transfer by ID', (done) => {
      // Arrange
      const entityId = 'entityId';
      const inventoryTransfer = { _id: entityId, name: 'Test Transfer' };
      jest
        .spyOn(model, 'findById')
        .mockReturnValueOnce(of(inventoryTransfer) as any);

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
          expect(result).toEqual(inventoryTransfer);
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

    it('should throw a NotFoundException if the inventory transfer is not found', (done) => {
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
