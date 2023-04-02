import { InventoryTransferMongoModel, StockMongoModel } from '..';

describe('InventoryTransferMongoModel', () => {
  test('should create a new inventory transfer with valid values', () => {
    // Arrange
    const stockIn = { _id: '1' } as unknown as StockMongoModel;
    const stockOut = { _id: '2' } as unknown as StockMongoModel;
    const quantity = 2;
    const _id = '123';

    // Act
    const inventoryTransfer = new InventoryTransferMongoModel(
      stockIn,
      stockOut,
      quantity,
      _id,
    );

    // Assert
    expect(inventoryTransfer).toBeDefined();
    expect(inventoryTransfer.stockIn).toBe(stockIn);
    expect(inventoryTransfer.stockOut).toBe(stockOut);
    expect(inventoryTransfer.quantity).toBe(quantity);
    expect(inventoryTransfer._id).toBe(_id);
  });

  test('should create a new inventory transfer with default values', () => {
    // Arrange
    const stockIn = { _id: '1' } as unknown as StockMongoModel;
    const stockOut = { _id: '2' } as unknown as StockMongoModel;
    const quantity = 2;

    // Act
    const inventoryTransfer = new InventoryTransferMongoModel(
      stockIn,
      stockOut,
      quantity,
    );

    // Assert
    expect(inventoryTransfer).toBeDefined();
    expect(inventoryTransfer.stockIn).toBe(stockIn);
    expect(inventoryTransfer.stockOut).toBe(stockOut);
    expect(inventoryTransfer.quantity).toBe(quantity);
    expect(inventoryTransfer._id).toBeUndefined();
  });
});
