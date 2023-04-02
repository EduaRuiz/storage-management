import { ProductMongoModel } from '..';

describe('ProductMongoModel', () => {
  it('should create a new product with valid values', () => {
    // Arrange
    const name = 'Product1';
    const description = 'This is a product';
    const price = 10.99;
    const _id = '123';

    // Act
    const product = new ProductMongoModel(name, description, price, _id);

    // Assert
    expect(product).toBeDefined();
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
    expect(product._id).toBe(_id);
  });

  it('should create a new product without _id', () => {
    // Arrange
    const name = 'Product1';
    const description = 'This is a product';
    const price = 10.99;

    // Act
    const product = new ProductMongoModel(name, description, price);

    // Assert
    expect(product).toBeDefined();
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
  });
});
