import { InventoryController } from '..';
import { LocationExistService } from '@inventory/infrastructure/utils/services';
import {
  RegisteredInventoryMovementPublisher,
  RegisteredNewProductPublisher,
  RemovedProductPublisher,
  UpdatedProductInfoPublisher,
} from '@inventory/infrastructure/messaging/publishers';
import { Test, TestingModule } from '@nestjs/testing';
import {
  InventoryMovementDto,
  NewProductDto,
  UpdateProductDto,
} from '@inventory/infrastructure/utils/dtos';
import {
  GetInventoryMovementsByProductUseCase,
  GetProductInfoUseCase,
  GetStocksByProductUseCase,
  RegisterInventoryMovementUseCase,
  RegisterNewProductUseCase,
  RemoveProductUseCase,
  UpdateProductInfoUseCase,
} from '@inventory/application/use-cases';
import { of } from 'rxjs';
import {
  InventoryMovementService,
  ProductService,
  StockService,
} from '@inventory/infrastructure/persistance/services';
import {
  InventoryMovementDomainModel,
  ProductDomainModel,
  StockDomainModel,
} from '@inventory/domain';

describe('InventoryController', () => {
  let controller: InventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: ProductService,
          useValue: {},
        },
        {
          provide: StockService,
          useValue: {},
        },
        {
          provide: LocationExistService,
          useValue: {},
        },
        {
          provide: InventoryMovementService,
          useValue: {},
        },
        {
          provide: RegisteredNewProductPublisher,
          useValue: {},
        },
        {
          provide: UpdatedProductInfoPublisher,
          useValue: {},
        },
        {
          provide: RegisteredInventoryMovementPublisher,
          useValue: {},
        },
        {
          provide: RemovedProductPublisher,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  describe('createProduct', () => {
    it('should create a new product', (done) => {
      // Arrange
      const product = { _id: '123' } as unknown as NewProductDto;
      const expectedProduct = { ...product } as unknown as ProductDomainModel;
      const execute = jest
        .spyOn(RegisterNewProductUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedProduct));

      // Act
      const result = controller.createProduct(product);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(product);
      result.subscribe({
        next: (value) => {
          expect(value).toBeDefined();
          expect(value).toBe(expectedProduct);
          done();
        },
      });
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', (done) => {
      // Arrange
      const productId = '123';
      const product = { productId } as unknown as UpdateProductDto;
      const expectedProduct = {
        _id: productId,
      } as unknown as ProductDomainModel;
      const execute = jest
        .spyOn(UpdateProductInfoUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedProduct));

      // Act
      const result = controller.updateProduct(productId, product);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(productId, product);
      result.subscribe({
        next: (value) => {
          expect(value).toBeDefined();
          expect(value._id).toBe(productId);
          expect(value).toBe(expectedProduct);
          done();
        },
      });
    });
  });

  describe('getProductInfo', () => {
    it('should return product info', (done) => {
      // Arrange
      const productId = '123';
      const expectedProduct = {
        _id: productId,
      } as unknown as ProductDomainModel;
      const execute = jest
        .spyOn(GetProductInfoUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedProduct));

      // Act
      const result = controller.getProductInfo(productId);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(productId);
      result.subscribe({
        next: (value) => {
          expect(value).toBeDefined();
          expect(value._id).toBe(productId);
          done();
        },
      });
    });
  });

  describe('registerInventoryMovement', () => {
    it('should register an inventory movement', (done) => {
      // Arrange
      const authHeader = 'Bearer token';
      const movement = { quantity: 1 } as unknown as InventoryMovementDto;
      const expectedMovement = {
        _id: '1',
      } as unknown as InventoryMovementDomainModel;
      const execute = jest
        .spyOn(RegisterInventoryMovementUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedMovement));

      // Act
      const result = controller.registerInventoryMovement(authHeader, movement);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(movement, 'token');
      result.subscribe({
        next: (value) => {
          expect(value).toBeDefined();
          expect(value).toBe(expectedMovement);
          expect(value._id).toBe(expectedMovement._id);
          done();
        },
      });
    });
  });

  describe('deleteProduct', () => {
    it('should remove a product', (done) => {
      // Arrange
      const productId = '123';
      const expectedProduct = {
        _id: productId,
      } as unknown as ProductDomainModel;
      const execute = jest
        .spyOn(RemoveProductUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedProduct));

      // Act
      const result = controller.deleteProduct(productId);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(productId);
      result.subscribe({
        next: (value) => {
          expect(value).toBe(expectedProduct);
          expect(value._id).toBe(expectedProduct._id);
          done();
        },
      });
    });
  });

  describe('getStocksByProduct', () => {
    it('should return stocks by product', (done) => {
      // Arrange
      const productId = '123';
      const expectedStocks = [
        {
          _id: '1',
        },
      ] as unknown as StockDomainModel[];
      const execute = jest
        .spyOn(GetStocksByProductUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedStocks));

      // Act
      const result = controller.getStocksByProduct(productId);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(productId);
      result.subscribe({
        next: (value) => {
          expect(value).toBeDefined();
          expect(value).toBe(expectedStocks);
          done();
        },
      });
    });
  });

  describe('getInventoryMovementsByProduct', () => {
    it('should return inventory movements by product', (done) => {
      // Arrange
      const productId = '123';
      const expectedMovements = [
        {
          _id: '1',
        },
      ] as unknown as InventoryMovementDomainModel[];
      const execute = jest
        .spyOn(GetInventoryMovementsByProductUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedMovements));

      // Act
      const result = controller.getInventoryMovementsByProduct(productId);

      // Assert
      expect(result).toBeDefined();
      expect(execute).toBeCalledWith(productId);
      result.subscribe({
        next: (value) => {
          expect(value).toBeDefined();
          expect(value).toBe(expectedMovements);
          done();
        },
      });
    });
  });
});
