import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredNewProductDomainEvent } from '@inventory/domain/events/publishers';

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
