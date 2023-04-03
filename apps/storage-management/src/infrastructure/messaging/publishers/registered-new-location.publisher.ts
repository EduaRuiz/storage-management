import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LocationModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredNewLocationDomainEvent } from '@storage/domain/events/publishers';

/**
 * Publicador de registro de nueva ubicación
 *
 * @export
 * @class RegisteredNewLocationPublisher
 * @extends {RegisteredNewLocationDomainEvent}
 */
@Injectable()
export class RegisteredNewLocationPublisher extends RegisteredNewLocationDomainEvent {
  /**
   * Crea una instancia de RegisteredNewLocationPublisher
   *
   * @param {ClientProxy} proxy Proxy de cliente
   * @memberof RegisteredNewLocationPublisher
   */
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  /**
   * Publica el evento de registro de nueva ubicación
   *
   * @param {LocationModel} data Datos de la ubicación
   * @return {Observable<LocationModel>} Observable con la ubicación
   * @memberof RegisteredNewLocationPublisher
   */
  publish(data: LocationModel): Observable<LocationModel> {
    return this.proxy.emit('registered-new-location', JSON.stringify(data));
  }
}
