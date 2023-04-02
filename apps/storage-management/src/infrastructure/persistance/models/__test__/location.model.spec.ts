import { LocationModel } from '..';

describe('LocationModel', () => {
  test('should create a new location with valid values', () => {
    // Arrange
    const name = 'Location1';
    const description = 'Description1';
    const address = 'Address1';
    const _id = '123';

    // Act
    const location = new LocationModel(name, description, address, _id);

    // Assert
    expect(location).toBeDefined();
    expect(location.name).toBe(name);
    expect(location.description).toBe(description);
    expect(location.address).toBe(address);
    expect(location._id).toBe(_id);
  });

  test('should create a new location with default values', () => {
    // Arrange
    const name = 'Location1';
    const description = 'Description1';
    const address = 'Address1';

    // Act
    const location = new LocationModel(name, description, address);

    // Assert
    expect(location).toBeDefined();
    expect(location.name).toBe(name);
    expect(location.description).toBe(description);
    expect(location.address).toBe(address);
    expect(location._id).toBeUndefined();
  });
});
