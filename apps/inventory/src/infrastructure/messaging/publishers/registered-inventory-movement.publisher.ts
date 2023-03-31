import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryMovementModel } from '../../persistance/models';
import { Observable } from 'rxjs';
import { RegisteredInventoryMovementDomainEvent } from '@inventory/domain/events/publishers';

@Injectable()
export class RegisteredInventoryMovementPublisher extends RegisteredInventoryMovementDomainEvent {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly proxy: ClientProxy,
  ) {
    super();
  }

  publish(data: InventoryMovementModel): Observable<InventoryMovementModel> {
    return this.proxy.emit(
      'registered-inventory-movement',
      JSON.stringify(data),
    );
  }
}
