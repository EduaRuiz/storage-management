import { RegisteredNewProductDomainEvent } from 'apps/inventory/src/domain/events/publishers';
import { Inject, Injectable } from '@nestjs/common';
import { ProductDomainModel } from 'apps/inventory/src/domain/models';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../../persistance/models';
import { Observable } from 'rxjs';

@Injectable()
export class RegisteredNewProductPublisher extends RegisteredNewProductDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: ProductModel): Observable<ProductModel> {
    return this.proxy.emit('registered-new-product', JSON.stringify(data));
  }
}
