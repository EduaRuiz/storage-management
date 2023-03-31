import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { UpdatedProductInfoDomainEvent } from '@inventory/domain/events/publishers';

@Injectable()
export class UpdatedProductInfoPublisher extends UpdatedProductInfoDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: ProductModel): Observable<ProductModel> {
    return this.proxy.emit('updated-product-info', JSON.stringify(data));
  }
}
