import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryMovementModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { GotInventoryMovementByProductDomainEvent } from 'apps/inventory/src/domain/events/publishers';

@Injectable()
export class GotInventoryMovementByProductPublisher extends GotInventoryMovementByProductDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(
    data: InventoryMovementModel[],
  ): Observable<InventoryMovementModel[]> {
    return this.proxy.emit(
      'got-inventory-movement-by-product',
      JSON.stringify(data),
    );
  }
}
