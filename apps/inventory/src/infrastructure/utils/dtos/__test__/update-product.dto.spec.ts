import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProductDto } from '..';

describe('UpdateProductDto', () => {
  let dto: UpdateProductDto;
  const validData = {
    _id: '611d8b86ebf1770c40fdd6b4',
    name: 'Product Name',
    description: 'Product Description',
    price: 10.5,
  };

  const invalidData = {
    _id: 'invalid-id',
    name: '',
    description: '',
    price: -10.5,
  };

  describe('when validating UpdateProductDto', () => {
    beforeEach(() => {
      dto = undefined;
    });

    it('should be defined', () => {
      // Arrange & Act
      dto = new UpdateProductDto();

      // Assert
      expect(dto).toBeDefined();
    });

    describe('and validating valid data', () => {
      let errors: any[];

      beforeEach(async () => {
        // Arrange
        dto = plainToInstance(UpdateProductDto, validData);

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
        _id: 'ProductId is not valid',
        name: 'name should not be empty',
        description: 'description should not be empty',
        price: 'price must be a positive number',
      };

      beforeEach(async () => {
        // Arrange
        dto = plainToInstance(UpdateProductDto, invalidData);

        // Act
        errors = await validate(dto);
      });

      it('should have errors', () => {
        // Assert
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should have expected errors', () => {
        // Assert
        expect(JSON.stringify(errors)).toContain(expectedErrors._id);
        expect(JSON.stringify(errors)).toContain(expectedErrors.name);
        expect(JSON.stringify(errors)).toContain(expectedErrors.description);
        expect(JSON.stringify(errors)).toContain(expectedErrors.price);
      });
    });
  });
});
