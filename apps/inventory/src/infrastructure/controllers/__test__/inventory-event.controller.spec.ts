import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { StockDomainModel } from '@inventory/domain/models';
import { InventoryEventController } from '..';
import { ProductService } from '@inventory/infrastructure/persistance/services';
import { StockService } from '@inventory/infrastructure/persistance/services';
import { StockStorageEventManagerUseCase } from '@inventory/application/use-cases';

describe('InventoryEventController', () => {
  let controller: InventoryEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryEventController],
      providers: [
        {
          provide: ProductService,
          useValue: {},
        },
        {
          provide: StockService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InventoryEventController>(InventoryEventController);
  });

  describe('registeredInventoryTransfer', () => {
    it('should call StockStorageEventManagerUseCase.execute twice and return an Observable with a StockDomainModel', () => {
      // Arrange
      const toManage = {
        stockOut: {} as unknown as StockDomainModel,
        stockIn: {} as unknown as StockDomainModel,
      };
      const expectedStockDomainModel: StockDomainModel = {
        quantity: 0,
        locationId: '',
        dateTime: new Date(),
      };
      const executeSpy = jest
        .spyOn(StockStorageEventManagerUseCase.prototype, 'execute')
        .mockReturnValueOnce(of(expectedStockDomainModel))
        .mockReturnValueOnce(of(expectedStockDomainModel));

      // Act
      const result: Observable<StockDomainModel> =
        controller.registeredInventoryTransfer(JSON.stringify(toManage));

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe((stockDomainModel) => {
        expect(stockDomainModel).toEqual(expectedStockDomainModel);
      });
      expect(executeSpy).toHaveBeenCalledTimes(2);
      expect(executeSpy).toHaveBeenCalledWith(toManage.stockOut);
      expect(executeSpy).toHaveBeenCalledWith(toManage.stockIn);
    });
  });
});
