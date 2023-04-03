import { InventoryTransferSwaggerEntity } from '..';

describe('InventoryTransferSwaggerEntity', () => {
  it('should create an instance of InventoryTransferSwaggerEntity with the correct values', () => {
    // Arrange and Act
    const inventoryTransferSwaggerEntity = new InventoryTransferSwaggerEntity();

    // Assert
    expect(inventoryTransferSwaggerEntity).toBeInstanceOf(
      InventoryTransferSwaggerEntity,
    );
  });
});
