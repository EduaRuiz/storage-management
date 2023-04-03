import { ProductSwaggerEntity } from '..';

describe('ProductSwaggerEntity', () => {
  it('should create an instance of ProductSwaggerEntity with the correct values', () => {
    // Arrange and Act
    const productSwaggerEntity = new ProductSwaggerEntity();

    // Assert
    expect(productSwaggerEntity).toBeInstanceOf(ProductSwaggerEntity);
  });
});
