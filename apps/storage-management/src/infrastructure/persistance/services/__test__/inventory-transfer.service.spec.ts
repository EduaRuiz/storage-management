import { InventoryTransferService } from '..';
import { InventoryTransferMongoService } from '../../database/mongo/services';

describe('InventoryTransferService', () => {
  let inventoryTransferService: InventoryTransferService;

  describe('when instantiated', () => {
    it('should extend InventoryTransferMongoService class', () => {
      inventoryTransferService = new InventoryTransferService(
        {} as any,
        {} as any,
      );
      expect(inventoryTransferService).toBeInstanceOf(
        InventoryTransferMongoService,
      );
    });
  });
});
