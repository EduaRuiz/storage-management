import {
  InventoryTransferDomainModel,
  LocationDomainModel,
  StockDomainModel,
} from '..';

describe('LocationDomainModel', () => {
  let location: LocationDomainModel;
  let name: string;
  let description: string;
  let address: string;
  let _id: string;
  let stock: StockDomainModel;
  let inventoryMovements: InventoryTransferDomainModel[];

  beforeEach(() => {
    // Arrange
    name = 'Sample name';
    description = 'Sample description';
    address = 'Sample address';
    _id = '123';
    stock = {} as unknown as StockDomainModel;
    inventoryMovements = [] as InventoryTransferDomainModel[];
    location = new LocationDomainModel(
      name,
      description,
      address,
      _id,
      stock,
      inventoryMovements,
    );
  });

  it('should create an instance of LocationDomainModel', () => {
    // Assert
    expect(location).toBeInstanceOf(LocationDomainModel);
    expect(location.name).toBe(name);
    expect(location.description).toBe(description);
    expect(location.address).toBe(address);
    expect(location._id).toBe(_id);
    expect(location.stock).toBe(stock);
    expect(location.inventoryMovements).toBe(inventoryMovements);
  });

  it('should create an instance of LocationDomainModel without optional parameters', () => {
    // Arrange
    location = new LocationDomainModel(name, description, address);

    // Assert
    expect(location).toBeInstanceOf(LocationDomainModel);
    expect(location.name).toBe(name);
    expect(location.description).toBe(description);
    expect(location.address).toBe(address);
    expect(location._id).toBeUndefined();
    expect(location.stock).toBeUndefined();
    expect(location.inventoryMovements).toBeUndefined();
  });
});
