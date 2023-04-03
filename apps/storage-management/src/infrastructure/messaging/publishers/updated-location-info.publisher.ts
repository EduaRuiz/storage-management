import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LocationModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { UpdatedLocationInfoDomainEvent } from '@storage/domain/events/publishers';

/**
 * Publicador de información de ubicación actualizada
 *
 * @export
 * @class UpdatedLocationInfoPublisher
 * @extends {UpdatedLocationInfoDomainEvent}
 */
@Injectable()
export class UpdatedLocationInfoPublisher extends UpdatedLocationInfoDomainEvent {
  /**
   * Crea una instancia de UpdatedLocationInfoPublisher
   *
   * @param {ClientProxy} proxy Proxy de cliente
   * @memberof UpdatedLocationInfoPublisher
   */
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  /**
   * Publica el evento de información de ubicación actualizada
   *
   * @param {LocationModel} data Datos de la ubicación
   * @return {Observable<LocationModel>} Observable con la ubicación
   * @memberof UpdatedLocationInfoPublisher
   */
  publish(data: LocationModel): Observable<LocationModel> {
    return this.proxy.emit('updated-location-info', JSON.stringify(data));
  }
}
