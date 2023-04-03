import { MessagePattern, Payload } from '@nestjs/microservices';
import { StockStorageEventManagerUseCase } from '../../application/use-cases';
import { Controller } from '@nestjs/common';
import { ProductService, StockService } from '../persistance/services';
import { Observable, switchMap, tap } from 'rxjs';
import { StockDomainModel } from '@inventory/domain/models';
import { IRegisteredInventoryTransferMap } from '../utils/interfaces';

@Controller()
export class InventoryEventController {
  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
  ) {}

  @MessagePattern('registered-inventory-transfer')
  registeredInventoryTransfer(
    @Payload() data: string,
  ): Observable<StockDomainModel> {
    const toManage: IRegisteredInventoryTransferMap = JSON.parse(data);
    const stockStorageEventManagerUseCase = new StockStorageEventManagerUseCase(
      this.stockService,
      this.productService,
    );
    return stockStorageEventManagerUseCase.execute(toManage?.stockOut).pipe(
      switchMap(() => {
        return stockStorageEventManagerUseCase.execute(toManage?.stockIn).pipe(
          tap(() => {
            console.log('registered-inventory-transfer');
          }),
        );
      }),
    );
  }
}
