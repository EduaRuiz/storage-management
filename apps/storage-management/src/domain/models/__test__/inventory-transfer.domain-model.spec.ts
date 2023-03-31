import { InventoryTransferDomainModel, StockDomainModel } from '..';

describe('InventoryTransferDomainModel', () => {
  let inventoryTransfer: InventoryTransferDomainModel;
  let quantity: number;
  let dateTime: Date;
  let stockIn: StockDomainModel;
  let stockOut: StockDomainModel;
  let _id: string;

  beforeEach(() => {
    // Arrange
    quantity = 10;
    dateTime = new Date();
    stockIn = {} as unknown as StockDomainModel;
    stockOut = {} as unknown as StockDomainModel;
    _id = '123';
    inventoryTransfer = new InventoryTransferDomainModel(
      quantity,
      dateTime,
      stockIn,
      stockOut,
      _id,
    );
  });

  it('should create an instance of InventoryTransferDomainModel', () => {
    // Assert
    expect(inventoryTransfer).toBeInstanceOf(InventoryTransferDomainModel);
    expect(inventoryTransfer.quantity).toBe(quantity);
    expect(inventoryTransfer.dateTime).toBe(dateTime);
    expect(inventoryTransfer.stockIn).toBe(stockIn);
    expect(inventoryTransfer.stockOut).toBe(stockOut);
    expect(inventoryTransfer._id).toBe(_id);
  });

  it('should create an instance of InventoryTransferDomainModel without optional parameters', () => {
    // Arrange
    inventoryTransfer = new InventoryTransferDomainModel(
      quantity,
      dateTime,
      stockIn,
      stockOut,
    );

    // Assert
    expect(inventoryTransfer).toBeInstanceOf(InventoryTransferDomainModel);
    expect(inventoryTransfer.quantity).toBe(quantity);
    expect(inventoryTransfer.dateTime).toBe(dateTime);
    expect(inventoryTransfer.stockIn).toBe(stockIn);
    expect(inventoryTransfer.stockOut).toBe(stockOut);
    expect(inventoryTransfer._id).toBeUndefined();
  });
});
