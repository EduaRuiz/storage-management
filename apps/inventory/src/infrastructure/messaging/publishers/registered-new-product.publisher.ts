import { RegisteredNewProductDomainEvent } from 'apps/inventory/src/domain/events/publishers';
import { Inject, Injectable } from '@nestjs/common';
import { ProductDomainEntity } from 'apps/inventory/src/domain/entities';
import { ClientProxy } from '@nestjs/microservices';
import { ProductEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';

@Injectable()
export class RegisteredNewProductPublisher extends RegisteredNewProductDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: ProductEntity): Observable<ProductEntity> {
    return this.proxy.emit('registered-new-product', JSON.stringify(data));
  }
}
