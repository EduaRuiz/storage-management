import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { UpdatedProductInfoDomainEvent } from 'apps/inventory/src/domain/events/publishers';

@Injectable()
export class UpdatedProductInfoPublisher extends UpdatedProductInfoDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: ProductEntity): Observable<ProductEntity> {
    return this.proxy.emit('updated-product-info', JSON.stringify(data));
  }
}
