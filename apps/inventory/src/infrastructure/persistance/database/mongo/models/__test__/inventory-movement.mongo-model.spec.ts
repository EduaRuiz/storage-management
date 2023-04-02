import { InventoryMovementMongoModel, StockMongoModel } from '..';

describe('InventoryMovementMongoModel', () => {
  test('should create a new inventory movement with valid values', () => {
    // Arrange
    const quantity = 10;
    const typeMovement = 'IN';
    const dateTime = new Date();
    const stock = { name: 'Product1' } as unknown as StockMongoModel;
    const _id = '123';

    // Act
    const inventoryMovement = new InventoryMovementMongoModel(
      quantity,
      typeMovement,
      dateTime,
      stock,
      _id,
    );

    // Assert
    expect(inventoryMovement).toBeDefined();
    expect(inventoryMovement.quantity).toBe(quantity);
    expect(inventoryMovement.typeMovement).toBe(typeMovement);
    expect(inventoryMovement.dateTime).toBe(dateTime);
    expect(inventoryMovement.stock).toBe(stock);
    expect(inventoryMovement._id).toBe(_id);
  });

  test('should create a new inventory movement without _id', () => {
    // Arrange
    const quantity = 10;
    const typeMovement = 'IN';
    const dateTime = new Date();
    const stock = { name: 'Product1' } as unknown as StockMongoModel;

    // Act
    const inventoryMovement = new InventoryMovementMongoModel(
      quantity,
      typeMovement,
      dateTime,
      stock,
    );

    // Assert
    expect(inventoryMovement).toBeDefined();
    expect(inventoryMovement.quantity).toBe(quantity);
    expect(inventoryMovement.typeMovement).toBe(typeMovement);
    expect(inventoryMovement.dateTime).toBe(dateTime);
    expect(inventoryMovement.stock).toBe(stock);
    expect(inventoryMovement._id).toBeUndefined();
  });
});
