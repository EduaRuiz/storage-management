import { Observable, of } from 'rxjs';
import { RegisteredInventoryMovementDomainEvent } from '..';
import { InventoryMovementDomainModel } from '../../../models';

class RegisteredInventoryMovementDomainEventImpl extends RegisteredInventoryMovementDomainEvent<InventoryMovementDomainModel> {
  publish(
    inventoryMovement: InventoryMovementDomainModel,
  ): Observable<InventoryMovementDomainModel> {
    return of(inventoryMovement);
  }
}

describe('RegisteredInventoryMovementDomainEvent', () => {
  let event: RegisteredInventoryMovementDomainEvent;
  let inventoryMovement: InventoryMovementDomainModel;
  let response$: Observable<InventoryMovementDomainModel>;

  beforeEach(() => {
    // Arrange
    inventoryMovement = {} as unknown as InventoryMovementDomainModel;
    event = new RegisteredInventoryMovementDomainEventImpl();
  });

  it('should publish inventory movement', (done) => {
    // Act
    response$ = event.publish(inventoryMovement);

    // Assert
    response$.subscribe((response) => {
      expect(response).toBe(inventoryMovement);
      done();
    });
  });
});
