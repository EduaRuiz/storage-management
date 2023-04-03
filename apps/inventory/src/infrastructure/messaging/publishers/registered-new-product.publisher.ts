import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredNewProductDomainEvent } from '@inventory/domain/events/publishers';

/**
 * Publicador de eventos de registro de nuevo producto
 *
 * @export
 * @class RegisteredNewProductPublisher
 * @extends {RegisteredNewProductDomainEvent}
 */
@Injectable()
export class RegisteredNewProductPublisher extends RegisteredNewProductDomainEvent {
  /**
   * Crea una instancia de RegisteredNewProductPublisher
   *
   * @param {ClientProxy} proxy Proxy de microservicios
   * @memberof RegisteredNewProductPublisher
   */
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  /**
   * Publica un evento de registro de nuevo producto
   *
   * @param {ProductModel} data Datos del producto
   * @return  {Observable<ProductModel>} Observable con los datos del producto
   * @memberof RegisteredNewProductPublisher
   */
  publish(data: ProductModel): Observable<ProductModel> {
    return this.proxy.emit('registered-new-product', JSON.stringify(data));
  }
}
