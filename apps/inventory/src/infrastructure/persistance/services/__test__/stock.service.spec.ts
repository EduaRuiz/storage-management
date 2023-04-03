import { StockService } from '..';
import { StockMongoService } from '../../database/mongo/services';

describe('StockService', () => {
  let stockService: StockService;

  describe('when instantiated', () => {
    it('should extend StockMongoService class', () => {
      stockService = new StockService({} as any);
      expect(stockService).toBeInstanceOf(StockMongoService);
    });
  });
});
