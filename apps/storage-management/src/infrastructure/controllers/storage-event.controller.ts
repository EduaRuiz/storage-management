import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocationService, StockService } from '../persistance/services';
import { Controller } from '@nestjs/common';
import { StockInventoryEventManagerUseCase } from '../../application/use-cases';
import { Observable, tap } from 'rxjs';
import { StockDomainModel } from '../../domain/models';
import { IRegisteredInventoryMovementMap } from '../utils/interfaces';

/**
 * Controlador de eventos de almacenamiento
 *
 * @export
 * @class StorageEventController
 */
@Controller()
export class StorageEventController {
  /**
   * Crea una instancia de StorageEventController
   *
   * @param {StockService} stock$ Servicio de persistencia de stock
   * @param {LocationService} location$ Servicio de persistencia de ubicación
   * @memberof StorageEventController
   */
  constructor(
    private readonly stock$: StockService,
    private readonly location$: LocationService,
  ) {}

  /**
   * Maneja el evento de registro de movimiento de inventario
   *
   * @param {string} data Datos del evento
   * @return {Observable<StockDomainModel>} Observable con el stock
   * @memberof StorageEventController
   */
  @MessagePattern('registered-inventory-movement')
  registeredInventoryMovement(
    @Payload() data: string,
  ): Observable<StockDomainModel> {
    const toManage: IRegisteredInventoryMovementMap = JSON.parse(data);
    const stockInventoryEventManagerUseCase =
      new StockInventoryEventManagerUseCase(this.stock$, this.location$);
    return stockInventoryEventManagerUseCase.execute(toManage?.stock).pipe(
      tap(() => {
        console.log('registered-inventory-movement');
      }),
    );
  }
}
