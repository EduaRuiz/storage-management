import {
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { InventoryTransferDto } from '..';

describe('InventoryTransferDto', () => {
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

  it('should validate valid data', () => {
    // Arrange
    const dto = new InventoryTransferDto();
    Object.assign(dto, validData);

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should validate invalid data', () => {
    // Arrange
    const dto = new InventoryTransferDto();
    Object.assign(dto, invalidData);

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      productId: 'ProductId is not valid',
      quantity: 'quantity must be a positive number',
    });
  });
});
