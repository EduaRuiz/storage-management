import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryTransferMongoModel, StockMongoModel } from '..';

describe('InventoryTransferMongoModel', () => {
  let inventoryTransfer: InventoryTransferMongoModel;
  let stockIn: StockMongoModel;
  let stockOut: StockMongoModel;

  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    stockIn = new StockMongoModel();
    stockIn.id = 'stockInId';
    stockOut = new StockMongoModel();
    stockOut.id = 'stockOutId';

    inventoryTransfer = new InventoryTransferMongoModel();
    inventoryTransfer.quantity = 10;
    inventoryTransfer.dateTime = new Date('2022-01-01');
    inventoryTransfer.stockIn = stockIn;
    inventoryTransfer.stockOut = stockOut;
  });

  afterEach(async () => {
    await InventoryTransferMongoModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should have the correct quantity', () => {
    expect(inventoryTransfer.quantity).toEqual(10);
  });

  it('should have the correct date-time', () => {
    expect(inventoryTransfer.dateTime).toEqual(new Date('2022-01-01'));
  });

  it('should have the correct stock-in', () => {
    expect(inventoryTransfer.stockIn.id).toEqual('stockInId');
  });

  it('should have the correct stock-out', () => {
    expect(inventoryTransfer.stockOut.id).toEqual('stockOutId');
  });

  it('should require quantity', () => {
    inventoryTransfer.quantity = undefined;

    const errors = inventoryTransfer.validateSync();

    expect(errors.errors['quantity'].message).toEqual(
      'Path `quantity` is required.',
    );
  });

  it('should require date-time', () => {
    inventoryTransfer.dateTime = undefined;

    const errors = inventoryTransfer.validateSync();

    expect(errors.errors['dateTime'].message).toEqual(
      'Path `dateTime` is required.',
    );
  });

  it('should require stock-in', () => {
    inventoryTransfer.stockIn = undefined;

    const errors = inventoryTransfer.validateSync();

    expect(errors.errors['stockIn'].message).toEqual(
      'Path `stockIn` is required.',
    );
  });

  it('should require stock-out', () => {
    inventoryTransfer.stockOut = undefined;

    const errors = inventoryTransfer.validateSync();

    expect(errors.errors['stockOut'].message).toEqual(
      'Path `stockOut` is required.',
    );
  });
});
