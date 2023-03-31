import { Observable, of } from 'rxjs';
import { InventoryTransferDomainModel } from '../../../models';
import { RegisteredInventoryTransferDomainEvent } from '..';

class RegisteredInventoryTransferDomainEventImpl extends RegisteredInventoryTransferDomainEvent<InventoryTransferDomainModel> {
  publish(
    inventoryTransfer: InventoryTransferDomainModel,
  ): Observable<InventoryTransferDomainModel> {
    return of(inventoryTransfer);
  }
}

describe('RegisteredInventoryTransferDomainEvent', () => {
  let event: RegisteredInventoryTransferDomainEvent<InventoryTransferDomainModel>;
  let inventoryTransfer: InventoryTransferDomainModel;

  beforeEach(() => {
    // Arrange
    inventoryTransfer = {} as unknown as InventoryTransferDomainModel;
    event = new RegisteredInventoryTransferDomainEventImpl();
  });

  it('should publish inventory transfer', (done) => {
    // Act
    const response$ = event.publish(inventoryTransfer);

    // Assert
    response$.subscribe((response) => {
      expect(response).toBe(inventoryTransfer);
      done();
    });
  });
});
