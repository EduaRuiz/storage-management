import { InventoryMovementDomainModel, StockDomainModel } from '..';

describe('InventoryMovementDomainModel', () => {
  let inventoryMovement: InventoryMovementDomainModel;
  let quantity: number;
  let typeMovement: 'IN' | 'OUT';
  let dateTime: Date;
  let _id: string;
  let stock: StockDomainModel;

  beforeEach(() => {
    // Arrange
    quantity = 10;
    typeMovement = 'IN';
    dateTime = new Date();
    _id = '123';
    stock = {} as unknown as StockDomainModel;
    inventoryMovement = new InventoryMovementDomainModel(
      quantity,
      typeMovement,
      dateTime,
      _id,
      stock,
    );
  });

  it('should create an instance of InventoryMovementDomainModel', () => {
    // Assert
    expect(inventoryMovement).toBeInstanceOf(InventoryMovementDomainModel);
    expect(inventoryMovement.quantity).toBe(quantity);
    expect(inventoryMovement.typeMovement).toBe(typeMovement);
    expect(inventoryMovement.dateTime).toBe(dateTime);
    expect(inventoryMovement._id).toBe(_id);
    expect(inventoryMovement.stock).toBe(stock);
  });

  it('should create an instance of InventoryMovementDomainModel without optional parameters', () => {
    // Arrange
    inventoryMovement = new InventoryMovementDomainModel(
      quantity,
      typeMovement,
      dateTime,
    );

    // Assert
    expect(inventoryMovement).toBeInstanceOf(InventoryMovementDomainModel);
    expect(inventoryMovement.quantity).toBe(quantity);
    expect(inventoryMovement.typeMovement).toBe(typeMovement);
    expect(inventoryMovement.dateTime).toBe(dateTime);
    expect(inventoryMovement._id).toBeUndefined();
    expect(inventoryMovement.stock).toBeUndefined();
  });
});
