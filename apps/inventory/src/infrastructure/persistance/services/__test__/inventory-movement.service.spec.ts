import { InventoryMovementService } from '..';
import { InventoryMovementMongoService } from '../../database/mongo/services';

describe('InventoryMovementService', () => {
  let inventoryMovementService: InventoryMovementService;

  describe('when instantiated', () => {
    it('should extend InventoryMovementMongoService class', () => {
      inventoryMovementService = new InventoryMovementService(
        {} as any,
        {} as any,
      );
      expect(inventoryMovementService).toBeInstanceOf(
        InventoryMovementMongoService,
      );
    });
  });
});
