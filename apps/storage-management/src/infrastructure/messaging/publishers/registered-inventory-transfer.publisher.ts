import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryTransferEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { RegisteredInventoryTransferDomainEvent } from 'apps/storage-management/src/domain/events/publishers';

@Injectable()
export class RegisteredInventoryTransferPublisher extends RegisteredInventoryTransferDomainEvent {
  constructor(@Inject('STORAGE_SERVICE') private readonly proxy: ClientProxy) {
    super();
  }

  publish(data: InventoryTransferEntity): Observable<InventoryTransferEntity> {
    return this.proxy.emit(
      'registered-inventory-transfer',
      JSON.stringify(data),
    );
  }
}
