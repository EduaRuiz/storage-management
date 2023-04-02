import { Test, TestingModule } from '@nestjs/testing';
import { ProductMongoService } from '..';
import { ProductMongoModel, ProductMongoRepository } from '../..';
import { of } from 'rxjs';

describe('ProductMongoService', () => {
  let service: ProductMongoService;
  let repository: ProductMongoRepository;

  const product: ProductMongoModel = {
    _id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductMongoService,
        {
          provide: ProductMongoRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductMongoService>(ProductMongoService);
    repository = module.get<ProductMongoRepository>(ProductMongoRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a product', (done) => {
      // Arrange
      jest.spyOn(repository, 'create').mockReturnValueOnce(of(product));

      // Act
      const result$ = service.create(product);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(product);
          expect(repository.create).toHaveBeenCalledWith(product);
          done();
        },
      });
    });
  });

  describe('update', () => {
    it('should update a product', (done) => {
      // Arrange
      const updatedProduct: ProductMongoModel = {
        ...product,
        name: 'Product 2',
      };
      jest.spyOn(repository, 'update').mockReturnValueOnce(of(updatedProduct));

      // Act
      const result$ = service.update(product._id, updatedProduct);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(updatedProduct);
          expect(repository.update).toHaveBeenCalledWith(
            product._id,
            updatedProduct,
          );
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a product', (done) => {
      // Arrange
      jest.spyOn(repository, 'delete').mockReturnValueOnce(of(product));

      // Act
      const result$ = service.delete(product._id);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(product);
          expect(repository.delete).toHaveBeenCalledWith(product._id);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all products', (done) => {
      // Arrange
      jest.spyOn(repository, 'findAll').mockReturnValueOnce(of([product]));

      // Act
      const result$ = service.findAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([product]);
          expect(repository.findAll).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a product by id', (done) => {
      // Arrange
      jest.spyOn(repository, 'findOneById').mockReturnValueOnce(of(product));

      // Act
      const result$ = service.findOneById(product._id);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(product);
          expect(repository.findOneById).toHaveBeenCalledWith(product._id);
          done();
        },
      });
    });
  });
});
