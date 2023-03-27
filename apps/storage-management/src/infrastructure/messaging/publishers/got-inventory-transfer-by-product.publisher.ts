import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryTransferEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { GotInventoryTransferByProductDomainEvent } from 'apps/storage-management/src/domain/events/publishers';

@Injectable()
export class GotInventoryTransferByProductPublisher extends GotInventoryTransferByProductDomainEvent {
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  publish(
    data: InventoryTransferEntity[],
  ): Observable<InventoryTransferEntity[]> {
    return this.proxy.emit(
      'got-inventory-transfer-by-product',
      JSON.stringify(data),
    );
  }
}
