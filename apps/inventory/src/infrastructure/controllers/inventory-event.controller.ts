import { MessagePattern, Payload } from '@nestjs/microservices';
import { StockStorageEventManagerUseCase } from '../../application/use-cases';
import { Controller } from '@nestjs/common';
import { ProductService, StockService } from '../persistance/services';
import { Observable, switchMap, tap } from 'rxjs';
import { StockDomainModel } from '@inventory/domain/models';
import { IRegisteredInventoryTransferMap } from '../utils/interfaces';

/**
 * Controlador de eventos de inventario
 *
 * @export
 * @class InventoryEventController
 */
@Controller()
export class InventoryEventController {
  /**
   * Crea una instancia de InventoryEventController
   *
   * @param {ProductService} productService Servicio de productos
   * @param {StockService} stockService Servicio de stock
   * @memberof InventoryEventController
   */
  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
  ) {}

  /**
   * Maneja el evento de registro de transferencia de inventario
   *
   * @param {string} data Datos del evento
   * @return  {Observable<StockDomainModel>} Observable con el stock
   * @memberof InventoryEventController
   */
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
