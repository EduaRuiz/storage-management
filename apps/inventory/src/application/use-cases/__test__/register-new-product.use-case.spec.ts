import { IProductDomainService } from 'apps/inventory/src/domain';
import { RegisteredNewProductDomainEvent } from 'apps/inventory/src/domain/events';
import { of, throwError } from 'rxjs';
import { RegisterNewProductUseCase } from '..';
import { INewProductDomainDto } from 'apps/inventory/src/domain/dtos';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';

describe('RegisterNewProductUseCase', () => {
  let product$: IProductDomainService;
  let registeredNewProductDomainEvent: RegisteredNewProductDomainEvent;
  let useCase: RegisterNewProductUseCase;

  beforeEach(() => {
    product$ = {
      create: jest.fn(),
    } as unknown as IProductDomainService;
    registeredNewProductDomainEvent = {
      publish: jest.fn(),
    } as unknown as RegisteredNewProductDomainEvent;
    useCase = new RegisterNewProductUseCase(
      product$,
      registeredNewProductDomainEvent,
    );
  });

  describe('execute', () => {
    it('should create a new product and publish an event', (done) => {
      // Arrange
      const newProductDto: INewProductDomainDto = {
        name: 'test product',
        description: 'test description',
        price: 10,
      };
      const createdProduct: ProductDomainModel = {
        _id: 'test-product-id',
        name: 'TEST PRODUCT',
        description: 'test description',
        price: 10,
      };

      jest.spyOn(product$, 'create').mockReturnValue(of(createdProduct));

      // Act
      const result$ = useCase.execute(newProductDto);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(createdProduct);
          expect(product$.create).toHaveBeenCalledWith(newProductDto);
          expect(registeredNewProductDomainEvent.publish).toHaveBeenCalledWith(
            createdProduct,
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should return an error if product creation fails', (done) => {
      // Arrange
      const newProductDto: INewProductDomainDto = {
        name: 'test product',
        description: 'test description',
        price: 10,
      };
      const error = 'Failed to create product';

      jest.spyOn(product$, 'create').mockReturnValue(throwError(error));

      // Act
      const result$ = useCase.execute(newProductDto);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(product$.create).toHaveBeenCalledWith(newProductDto);
          expect(
            registeredNewProductDomainEvent.publish,
          ).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
