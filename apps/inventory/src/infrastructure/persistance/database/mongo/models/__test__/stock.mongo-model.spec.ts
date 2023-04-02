import { ProductMongoModel, StockMongoModel } from '..';

describe('StockMongoModel', () => {
  test('should create a new stock with valid values', () => {
    // Arrange
    const quantity = 10;
    const locationId = 'location1';
    const dateTime = new Date();
    const product = { name: 'Product1' } as unknown as ProductMongoModel;
    const _id = '123';

    // Act
    const stock = new StockMongoModel(
      quantity,
      locationId,
      dateTime,
      product,
      _id,
    );

    // Assert
    expect(stock).toBeDefined();
    expect(stock.quantity).toBe(quantity);
    expect(stock.locationId).toBe(locationId);
    expect(stock.dateTime).toBe(dateTime);
    expect(stock.product).toBe(product);
    expect(stock._id).toBe(_id);
  });

  test('should create a new stock without _id', () => {
    // Arrange
    const quantity = 10;
    const locationId = 'location1';
    const dateTime = new Date();
    const product = { name: 'Product1' } as unknown as ProductMongoModel;

    // Act
    const stock = new StockMongoModel(quantity, locationId, dateTime, product);

    // Assert
    expect(stock).toBeDefined();
    expect(stock.quantity).toBe(quantity);
    expect(stock.locationId).toBe(locationId);
    expect(stock.dateTime).toBe(dateTime);
    expect(stock.product).toBe(product);
    expect(stock._id).toBeUndefined();
  });
});
