import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryMovementEntity } from '../../persistance/entities';
import { Observable } from 'rxjs';
import { RegisteredInventoryMovementDomainEvent } from 'apps/inventory/src/domain/events/publishers';

@Injectable()
export class RegisteredInventoryMovementPublisher extends RegisteredInventoryMovementDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: InventoryMovementEntity): Observable<InventoryMovementEntity> {
    return this.proxy.emit(
      'registered-inventory-movement',
      JSON.stringify(data),
    );
  }
}
