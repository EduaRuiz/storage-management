import { IStockDomainService } from 'apps/inventory/src/domain';
import { of } from 'rxjs';
import { GetStocksByProductUseCase } from '../get-stock-by-product.use-case';
import { StockDomainModel } from 'apps/inventory/src/domain/models';

describe('GetStocksByProductUseCase', () => {
  let stockService: IStockDomainService;
  let useCase: GetStocksByProductUseCase;

  beforeEach(() => {
    stockService = {
      findAllByProductId: jest.fn(),
    } as unknown as IStockDomainService;
    useCase = new GetStocksByProductUseCase(stockService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an Observable of StockDomainModel[]', (done) => {
      // Arrange
      const productId = 'test-product-id';
      const stocks: StockDomainModel[] = [
        {
          locationId: 'test-product-id',
          quantity: 10,
          dateTime: new Date(),
        },
        {
          locationId: 'test-product-id',
          dateTime: new Date(),
          quantity: 5,
        },
      ];
      jest
        .spyOn(stockService, 'findAllByProductId')
        .mockReturnValue(of(stocks));

      // Act
      const result$ = useCase.execute(productId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(stocks);
          done();
        },
        error: done.fail,
      });
      expect(stockService.findAllByProductId).toHaveBeenCalledWith(productId);
      expect(result$).toEqual(expect.any(Object));
      expect(result$.subscribe).toEqual(expect.any(Function));
      result$.subscribe((result) => {
        expect(result).toEqual(stocks);
      });
    });
  });
});
