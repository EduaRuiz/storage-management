import { LocationMongoModel, StockMongoModel } from '..';

describe('StockMongoModel', () => {
  test('should create a new stock with valid values', () => {
    // Arrange
    const location = { _id: '1' } as unknown as LocationMongoModel;
    const quantity = 10;
    const productId = '123';
    const _id = '456';

    // Act
    const stock = new StockMongoModel(location, quantity, productId, _id);

    // Assert
    expect(stock).toBeDefined();
    expect(stock.location).toBe(location);
    expect(stock.quantity).toBe(quantity);
    expect(stock.productId).toBe(productId);
    expect(stock._id).toBe(_id);
  });

  test('should create a new stock with default values', () => {
    // Arrange
    const location = { _id: '1' } as unknown as LocationMongoModel;
    const quantity = 10;
    const productId = '123';

    // Act
    const stock = new StockMongoModel(location, quantity, productId);

    // Assert
    expect(stock).toBeDefined();
    expect(stock.location).toBe(location);
    expect(stock.quantity).toBe(quantity);
    expect(stock.productId).toBe(productId);
    expect(stock._id).toBeUndefined();
  });
});
