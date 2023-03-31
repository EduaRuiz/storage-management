import { LocationDomainModel, StockDomainModel } from '..';

describe('StockDomainModel', () => {
  let stock: StockDomainModel;
  let quantity: number;
  let productId: string;
  let dateTime: Date;
  let _id: string;
  let location: LocationDomainModel;

  beforeEach(() => {
    // Arrange
    quantity = 10;
    productId = '123';
    dateTime = new Date();
    _id = '456';
    location = {} as unknown as LocationDomainModel;
    stock = new StockDomainModel(quantity, productId, dateTime, _id, location);
  });

  it('should create an instance of StockDomainModel', () => {
    // Assert
    expect(stock).toBeInstanceOf(StockDomainModel);
    expect(stock.quantity).toBe(quantity);
    expect(stock.productId).toBe(productId);
    expect(stock.dateTime).toBe(dateTime);
    expect(stock._id).toBe(_id);
    expect(stock.location).toBe(location);
  });

  it('should create an instance of StockDomainModel without optional parameters', () => {
    // Arrange
    stock = new StockDomainModel(quantity, productId, dateTime);

    // Assert
    expect(stock).toBeInstanceOf(StockDomainModel);
    expect(stock.quantity).toBe(quantity);
    expect(stock.productId).toBe(productId);
    expect(stock.dateTime).toBe(dateTime);
    expect(stock._id).toBeUndefined();
    expect(stock.location).toBeUndefined();
  });
});
