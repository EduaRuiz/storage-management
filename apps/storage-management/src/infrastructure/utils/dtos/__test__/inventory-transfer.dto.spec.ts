import { validate } from 'class-validator';
import { InventoryTransferDto } from '..';
import { plainToInstance } from 'class-transformer';

describe('InventoryTransferDto', () => {
  let dto: InventoryTransferDto;
  const validData = {
    productId: '611d8b86ebf1770c40fdd6b4',
    locationInId: '611d8b86ebf1770c40fdd6b5',
    locationOutId: '611d8b86ebf1770c40fdd6b6',
    quantity: 5,
  };

  const invalidData = {
    productId: '',
    locationInId: '611d8b86ebf1770c40fdd6b5',
    locationOutId: '611d8b86ebf1770c40fdd6b6',
    quantity: -5,
  };

  beforeEach(() => {
    dto = new InventoryTransferDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate valid data', async () => {
    // Arrange
    dto = plainToInstance(InventoryTransferDto, validData);

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should validate invalid data', async () => {
    // Arrange
    dto = plainToInstance(InventoryTransferDto, invalidData);
    const expectedErrors = {
      matches: 'ProductId is not valid',
      productId: 'ProductId is not valid',
      quantity: 'quantity must be a positive number',
    };

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    console.log(JSON.stringify(errors));
    expect(JSON.stringify(errors)).toContain(expectedErrors.matches),
      expect(JSON.stringify(errors)).toContain(expectedErrors.productId),
      expect(JSON.stringify(errors)).toContain(expectedErrors.quantity);
  });
});
