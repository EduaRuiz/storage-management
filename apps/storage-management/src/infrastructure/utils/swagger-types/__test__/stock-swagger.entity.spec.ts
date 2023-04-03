import { StockSwaggerEntity } from '..';

describe('StockSwaggerEntity', () => {
  it('should create an instance of StockSwaggerEntity with the correct values', () => {
    // Arrange and Act
    const stockSwaggerEntity = new StockSwaggerEntity();

    // Assert
    expect(stockSwaggerEntity).toBeInstanceOf(StockSwaggerEntity);
  });
});
