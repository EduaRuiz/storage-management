import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LocationEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { RegisteredNewLocationDomainEvent } from 'apps/storage-management/src/domain/events/publishers';

@Injectable()
export class RegisteredNewLocationPublisher extends RegisteredNewLocationDomainEvent {
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  publish(data: LocationEntity): Observable<LocationEntity> {
    return this.proxy.emit('registered-new-location', JSON.stringify(data));
  }
}
