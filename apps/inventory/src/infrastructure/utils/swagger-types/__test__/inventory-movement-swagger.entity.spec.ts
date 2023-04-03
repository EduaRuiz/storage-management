import { InventoryMovementSwaggerEntity } from '..';

describe('InventoryMovementSwaggerEntity', () => {
  it('should create an instance of InventoryMovementSwaggerEntity with the correct values', () => {
    // Arrange and Act
    const inventoryMovementSwaggerEntity = new InventoryMovementSwaggerEntity();

    // Assert
    expect(inventoryMovementSwaggerEntity).toBeInstanceOf(
      InventoryMovementSwaggerEntity,
    );
  });
});
