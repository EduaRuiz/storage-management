import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { NewLocationDto } from '..';

describe('NewLocationDto', () => {
  let dto: NewLocationDto;
  const validData = {
    name: 'Name 1',
    description: 'Description 1',
    address: 'Address 1',
  };

  const invalidData = {
    name: '',
    description: '',
    address: 'a'.repeat(101),
  };

  beforeEach(() => {
    dto = new NewLocationDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate valid data', async () => {
    // Arrange
    dto = plainToInstance(NewLocationDto, validData);

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should validate invalid data', async () => {
    // Arrange
    // const dto = new NewLocationDto();
    const expectedErrors = {
      name: 'name should not be empty',
      description: 'description should not be empty',
      address: 'address must be shorter than or equal to 100',
    };
    const dto = plainToInstance(NewLocationDto, invalidData);

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    console.log(JSON.stringify(errors));
    expect(JSON.stringify(errors)).toContain(expectedErrors.name),
      expect(JSON.stringify(errors)).toContain(expectedErrors.description),
      expect(JSON.stringify(errors)).toContain(expectedErrors.address);
  });
});
