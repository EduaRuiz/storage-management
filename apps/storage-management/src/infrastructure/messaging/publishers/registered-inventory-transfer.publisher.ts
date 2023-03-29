import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryTransferModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredInventoryTransferDomainEvent } from 'apps/storage-management/src/domain/events/publishers';

@Injectable()
export class RegisteredInventoryTransferPublisher extends RegisteredInventoryTransferDomainEvent {
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  publish(data: InventoryTransferModel): Observable<InventoryTransferModel> {
    return this.proxy.emit(
      'registered-inventory-transfer',
      JSON.stringify(data),
    );
  }
}
