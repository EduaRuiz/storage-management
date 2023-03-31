import { IInventoryMovementDomainService } from 'apps/inventory/src/domain';
import { of } from 'rxjs';
import { GetInventoryMovementsByProductUseCase } from '../get-inventory-movement-by-product.use-case';
import { InventoryMovementDomainModel } from 'apps/inventory/src/domain/models';

describe('GetInventoryMovementsByProductUseCase', () => {
  let inventoryMovement$: IInventoryMovementDomainService;
  let useCase: GetInventoryMovementsByProductUseCase;

  beforeEach(() => {
    inventoryMovement$ = {
      findAllByProductId: jest.fn(),
    } as unknown as IInventoryMovementDomainService;
    useCase = new GetInventoryMovementsByProductUseCase(inventoryMovement$);
  });

  describe('execute', () => {
    it('should return an Observable of InventoryMovementDomainModel[]', (done) => {
      // Arrange
      const productId = 'test-product-id';
      const inventoryMovements: InventoryMovementDomainModel[] = [
        {
          typeMovement: 'IN',
          _id: '1',
          quantity: 10,
          dateTime: new Date(),
        },
        {
          _id: '2',
          typeMovement: 'IN',
          quantity: -10,
          dateTime: new Date(),
        },
      ];
      // Act
      jest
        .spyOn(inventoryMovement$, 'findAllByProductId')
        .mockReturnValue(of(inventoryMovements));
      const result$ = useCase.execute(productId);
      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(inventoryMovements);
          done();
        },
        error: done.fail,
      });
      expect(inventoryMovement$.findAllByProductId).toHaveBeenCalledWith(
        productId,
      );
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
      result$.subscribe((result) => {
        expect(result).toEqual(inventoryMovements);
      });
    });
  });
});
