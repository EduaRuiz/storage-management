import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { StockEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { GotStocksByProductDomainEvent } from 'apps/inventory/src/domain/events/publishers';

@Injectable()
export class GotStocksByProductPublisher extends GotStocksByProductDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: StockEntity[]): Observable<StockEntity[]> {
    return this.proxy.emit('updated-product-info', JSON.stringify(data));
  }
}
