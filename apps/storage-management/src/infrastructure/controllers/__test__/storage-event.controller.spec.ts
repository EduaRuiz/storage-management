import {
  LocationService,
  StockService,
} from '@storage/infrastructure/persistance/services';
import { StorageEventController } from '..';
import { StockInventoryEventManagerUseCase } from '@storage/application/use-cases';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { StockDomainModel } from '@storage/domain/models';

describe('StorageEventController', () => {
  let controller: StorageEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageEventController],
      providers: [
        {
          provide: StockService,
          useValue: {},
        },
        {
          provide: LocationService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<StorageEventController>(StorageEventController);
  });

  describe('inscriptionCommitted', () => {
    it('should call StockInventoryEventManagerUseCase.execute and return an Observable with a StockDomainModel', () => {
      // Arrange
      const toManage = {
        stock: {} as unknown as StockDomainModel,
      };
      const expectedStockDomainModel: StockDomainModel = {
        quantity: 0,
        productId: '',
        dateTime: new Date(),
      };

      const executeSpy = jest
        .spyOn(StockInventoryEventManagerUseCase.prototype, 'execute')
        .mockReturnValueOnce(of(expectedStockDomainModel));

      // Act
      const result: Observable<StockDomainModel> =
        controller.inscriptionCommitted(JSON.stringify(toManage));
      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe((stockDomainModel) => {
        expect(stockDomainModel).toEqual(expectedStockDomainModel);
      });
      expect(executeSpy).toHaveBeenCalledTimes(1);
      expect(executeSpy).toHaveBeenCalledWith(toManage.stock);
    });
  });
});
