import { ProductDomainModel, StockDomainModel } from '..';

describe('StockDomainModel', () => {
  let stock: StockDomainModel;
  let quantity: number;
  let locationId: string;
  let dateTime: Date;
  let _id: string;
  let product: ProductDomainModel;

  beforeEach(() => {
    // Arrange
    quantity = 10;
    locationId = '123';
    dateTime = new Date();
    _id = '456';
    product = {} as unknown as ProductDomainModel;
    stock = new StockDomainModel(quantity, locationId, dateTime, _id, product);
  });

  it('should create an instance of StockDomainModel', () => {
    // Assert
    expect(stock).toBeInstanceOf(StockDomainModel);
    expect(stock.quantity).toBe(quantity);
    expect(stock.locationId).toBe(locationId);
    expect(stock._id).toBe(_id);
    expect(stock.product).toBe(product);
    expect(stock.dateTime).toBe(dateTime);
  });

  it('should create an instance of StockDomainModel without optional parameters', () => {
    // Arrange
    stock = new StockDomainModel(quantity, locationId, dateTime);

    // Assert
    expect(stock).toBeInstanceOf(StockDomainModel);
    expect(stock.quantity).toBe(quantity);
    expect(stock.locationId).toBe(locationId);
    expect(stock._id).toBeUndefined();
    expect(stock.product).toBeUndefined();
    expect(stock.dateTime).toBe(dateTime);
  });
});
