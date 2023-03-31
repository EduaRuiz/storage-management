import {
  InventoryMovementDomainModel,
  ProductDomainModel,
  StockDomainModel,
} from '..';

describe('ProductDomainModel', () => {
  let product: ProductDomainModel;
  let name: string;
  let description: string;
  let price: number;
  let _id: string;
  let stock: StockDomainModel;
  let inventoryMovements: InventoryMovementDomainModel[];

  beforeEach(() => {
    // Arrange
    name = 'Product Name';
    description = 'Product Description';
    price = 10;
    _id = '123';
    stock = {} as unknown as StockDomainModel;
    inventoryMovements = [
      { quantity: 10, typeMovement: 'IN', dateTime: new Date() },
    ];
    product = new ProductDomainModel(
      name,
      description,
      price,
      _id,
      stock,
      inventoryMovements,
    );
  });

  it('should create an instance of ProductDomainModel', () => {
    // Assert
    expect(product).toBeInstanceOf(ProductDomainModel);
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
    expect(product._id).toBe(_id);
    expect(product.stock).toBe(stock);
    expect(product.inventoryMovements).toBe(inventoryMovements);
  });

  it('should create an instance of ProductDomainModel without optional parameters', () => {
    // Arrange
    product = new ProductDomainModel(name, description, price);

    // Assert
    expect(product).toBeInstanceOf(ProductDomainModel);
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
    expect(product._id).toBeUndefined();
    expect(product.stock).toBeUndefined();
    expect(product.inventoryMovements).toBeUndefined();
  });
});
