import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { UpdatedProductInfoDomainEvent } from '@inventory/domain/events/publishers';

/**
 * Publicador de eventos de actualización de información de producto
 *
 * @export
 * @class UpdatedProductInfoPublisher
 * @extends {UpdatedProductInfoDomainEvent}
 */
@Injectable()
export class UpdatedProductInfoPublisher extends UpdatedProductInfoDomainEvent {
  /**
   * Crea una instancia de UpdatedProductInfoPublisher
   *
   * @param {ClientProxy} proxy Proxy de microservicios
   * @memberof UpdatedProductInfoPublisher
   */
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  /**
   * Publica un evento de actualización de información de producto
   *
   * @param {ProductModel} data Datos del producto
   * @return  {Observable<ProductModel>} Observable con los datos del producto
   * @memberof UpdatedProductInfoPublisher
   */
  publish(data: ProductModel): Observable<ProductModel> {
    return this.proxy.emit('updated-product-info', JSON.stringify(data));
  }
}
