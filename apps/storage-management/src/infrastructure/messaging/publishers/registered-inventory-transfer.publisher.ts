import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryTransferModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredInventoryTransferDomainEvent } from '@storage/domain/events/publishers';

/**
 * Publicador de registro de transferencia de inventario
 *
 * @export
 * @class RegisteredInventoryTransferPublisher
 * @extends {RegisteredInventoryTransferDomainEvent}
 */
@Injectable()
export class RegisteredInventoryTransferPublisher extends RegisteredInventoryTransferDomainEvent {
  /**
   * Crea una instancia de RegisteredInventoryTransferPublisher
   *
   * @param {ClientProxy} proxy Proxy de cliente
   * @memberof RegisteredInventoryTransferPublisher
   */
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  /**
   * Publica el evento de registro de transferencia de inventario
   *
   * @param {InventoryTransferModel} data Datos de la transferencia de inventario
   * @return  {Observable<InventoryTransferModel>} Observable con la transferencia de inventario
   * @memberof RegisteredInventoryTransferPublisher
   */
  publish(data: InventoryTransferModel): Observable<InventoryTransferModel> {
    return this.proxy.emit(
      'registered-inventory-transfer',
      JSON.stringify(data),
    );
  }
}
