import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RemovedProductDomainEvent } from '@inventory/domain/events/publishers';

/**
 * Publicador de eventos de eliminación de producto
 *
 * @export
 * @class RemovedProductPublisher
 * @extends {RemovedProductDomainEvent}
 */
@Injectable()
export class RemovedProductPublisher extends RemovedProductDomainEvent {
  /**
   * Crea una instancia de RemovedProductPublisher
   *
   * @param {ClientProxy} proxy Proxy de microservicios
   * @memberof RemovedProductPublisher
   */
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  /**
   * Publica un evento de eliminación de producto
   *
   * @param {ProductModel} data Datos del producto
   * @return  {Observable<ProductModel>} Observable con los datos del producto
   * @memberof RemovedProductPublisher
   */
  publish(data: ProductModel): Observable<ProductModel> {
    return this.proxy.emit('removed-product', JSON.stringify(data));
  }
}
