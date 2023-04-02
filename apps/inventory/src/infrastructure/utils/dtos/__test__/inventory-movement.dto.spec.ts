import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InventoryMovementDto } from '..';

describe('InventoryMovementDto', () => {
  let dto: InventoryMovementDto;
  const validData = {
    productId: '611d8b86ebf1770c40fdd6b4',
    locationId: '611d8b86ebf1770c40fdd6b4',
    quantity: 10,
    typeMovement: 'IN',
  };

  const invalidData = {
    productId: 'invalid-product-id',
    locationId: 'invalid-location-id',
    quantity: -10,
    typeMovement: 'INVALID',
  };

  describe('when validating InventoryMovementDto', () => {
    beforeEach(() => {
      dto = undefined;
    });

    it('should be defined', () => {
      // Arrange & Act
      dto = new InventoryMovementDto();

      // Assert
      expect(dto).toBeDefined();
    });

    describe('and validating valid data', () => {
      let errors: any[];

      beforeEach(async () => {
        // Arrange
        dto = plainToInstance(InventoryMovementDto, validData);

        // Act
        errors = await validate(dto);
      });

      it('should not have errors', () => {
        // Assert
        expect(errors.length).toBe(0);
      });
    });

    describe('and validating invalid data', () => {
      let errors: any[];

      const expectedErrors = {
        productId: 'ProductId is not valid',
        locationId: 'LocationId is not valid',
        quantity: 'quantity must be a positive number',
        typeMovement:
          'typeMovement must be one of the following values: IN, OUT',
      };

      beforeEach(async () => {
        // Arrange
        dto = plainToInstance(InventoryMovementDto, invalidData);

        // Act
        errors = await validate(dto);
      });

      it('should have errors', () => {
        // Assert
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should have expected errors', () => {
        // Assert
        expect(JSON.stringify(errors)).toContain(expectedErrors.productId);
        expect(JSON.stringify(errors)).toContain(expectedErrors.locationId);
        expect(JSON.stringify(errors)).toContain(expectedErrors.quantity);
        expect(JSON.stringify(errors)).toContain(expectedErrors.typeMovement);
      });
    });
  });
});
