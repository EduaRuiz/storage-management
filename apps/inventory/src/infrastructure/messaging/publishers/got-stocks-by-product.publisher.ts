import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { StockModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { GotStocksByProductDomainEvent } from 'apps/inventory/src/domain/events/publishers';

@Injectable()
export class GotStocksByProductPublisher extends GotStocksByProductDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: StockModel[]): Observable<StockModel[]> {
    return this.proxy.emit('got-stocks-by-product', JSON.stringify(data));
  }
}
