import { InventoryTransferModel, StockModel } from '..';

describe('InventoryTransferModel', () => {
  test('should create a new inventory transfer with valid values', () => {
    // Arrange
    const stockIn = { _id: '1' } as unknown as StockModel;
    const stockOut = { _id: '2' } as unknown as StockModel;
    const quantity = 2;
    const _id = '123';

    // Act
    const inventoryTransfer = new InventoryTransferModel(
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
    const stockIn = { _id: '1' } as unknown as StockModel;
    const stockOut = { _id: '2' } as unknown as StockModel;
    const quantity = 2;

    // Act
    const inventoryTransfer = new InventoryTransferModel(
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
