import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LocationEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { GotLocationInfoDomainEvent } from 'apps/storage-management/src/domain/events/publishers';

@Injectable()
export class GotLocationInfoPublisher extends GotLocationInfoDomainEvent {
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  publish(data: LocationEntity): Observable<LocationEntity> {
    return this.proxy.emit('got-location-info', JSON.stringify(data));
  }
}
