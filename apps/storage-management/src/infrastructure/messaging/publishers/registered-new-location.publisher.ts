import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LocationModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredNewLocationDomainEvent } from '@storage/domain/events/publishers';

@Injectable()
export class RegisteredNewLocationPublisher extends RegisteredNewLocationDomainEvent {
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  publish(data: LocationModel): Observable<LocationModel> {
    return this.proxy.emit('registered-new-location', JSON.stringify(data));
  }
}
