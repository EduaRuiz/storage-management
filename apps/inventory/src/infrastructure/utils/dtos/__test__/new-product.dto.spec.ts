import { validate } from 'class-validator';
import { NewProductDto } from '..';
import { plainToInstance } from 'class-transformer';

describe('NewProductDto', () => {
  let dto: NewProductDto;
  const validData = {
    name: 'Product Name',
    description: 'Product Description',
    price: 10.5,
  };

  const invalidData = {
    name: '',
    description: '',
    price: -10.5,
  };

  describe('when validating NewProductDto', () => {
    beforeEach(() => {
      dto = undefined;
    });

    it('should be defined', () => {
      // Arrange & Act
      dto = new NewProductDto();

      // Assert
      expect(dto).toBeDefined();
    });

    describe('and validating valid data', () => {
      let errors: any[];

      beforeEach(async () => {
        // Arrange
        dto = plainToInstance(NewProductDto, validData);

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
        name: 'name should not be empty',
        description: 'description should not be empty',
        price: 'price must be a positive number',
      };

      beforeEach(async () => {
        // Arrange
        dto = plainToInstance(NewProductDto, invalidData);

        // Act
        errors = await validate(dto);
      });

      it('should have errors', () => {
        // Assert
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should have expected errors', () => {
        // Assert
        expect(JSON.stringify(errors)).toContain(expectedErrors.name);
        expect(JSON.stringify(errors)).toContain(expectedErrors.description);
        expect(JSON.stringify(errors)).toContain(expectedErrors.price);
      });
    });
  });
});
