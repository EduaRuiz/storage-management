import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { GotProductInfoDomainEvent } from 'apps/inventory/src/domain/events/publishers';

@Injectable()
export class GotProductInfoPublisher extends GotProductInfoDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: ProductEntity): Observable<ProductEntity> {
    return this.proxy.emit('got-product-info', JSON.stringify(data));
  }
}
