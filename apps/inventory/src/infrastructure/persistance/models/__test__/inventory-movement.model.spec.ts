import { InventoryMovementModel, StockMongoModel } from '../..';

describe('InventoryMovementModel', () => {
  it('should create a new inventory movement with valid values', () => {
    // Arrange
    const quantity = 2;
    const typeMovement = 'IN';
    const dateTime = new Date();
    const stock = { _id: '1' } as unknown as StockMongoModel;
    const _id = '123';

    // Act
    const inventoryMovement = new InventoryMovementModel(
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
    expect(inventoryMovement.stock).toBe(stock);
    expect(inventoryMovement.dateTime).toBe(dateTime);
    expect(inventoryMovement._id).toBe(_id);
  });

  test('should create a new inventory movement with default values', () => {
    // Arrange
    const quantity = 2;
    const typeMovement = 'IN';
    const dateTime = new Date();
    const stock = { _id: '1' } as unknown as StockMongoModel;

    // Act
    const inventoryMovement = new InventoryMovementModel(
      quantity,
      typeMovement,
      dateTime,
      stock,
    );

    // Assert
    expect(inventoryMovement).toBeDefined();
    expect(inventoryMovement.quantity).toBe(quantity);
    expect(inventoryMovement.typeMovement).toBe(typeMovement);
    expect(inventoryMovement.stock).toBe(stock);
    expect(inventoryMovement.dateTime).toBe(dateTime);
    expect(inventoryMovement._id).toBeUndefined();
  });
});
