import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryMovementModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredInventoryMovementDomainEvent } from '@inventory/domain/events/publishers';

/**
 * Publicador de eventos de registro de movimiento de inventario
 *
 * @export
 * @class RegisteredInventoryMovementPublisher
 * @extends {RegisteredInventoryMovementDomainEvent}
 */
@Injectable()
export class RegisteredInventoryMovementPublisher extends RegisteredInventoryMovementDomainEvent {
  /**
   * Crea una instancia de RegisteredInventoryMovementPublisher
   *
   * @param {ClientProxy} proxy Proxy de microservicios
   * @memberof RegisteredInventoryMovementPublisher
   */
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  /**
   * Publica un evento de registro de movimiento de inventario
   *
   * @param {InventoryMovementModel} data Datos del movimiento de inventario
   * @return  {Observable<InventoryMovementModel>} Observable con los datos del movimiento de inventario
   * @memberof RegisteredInventoryMovementPublisher
   */
  publish(data: InventoryMovementModel): Observable<InventoryMovementModel> {
    return this.proxy.emit(
      'registered-inventory-movement',
      JSON.stringify(data),
    );
  }
}
