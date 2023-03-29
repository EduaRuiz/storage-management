import { Observable, tap } from 'rxjs';
import { GotInventoryMovementByProductDomainEvent } from '../../domain/events/publishers';
import { IInventoryMovementDomainService } from '../../domain/services';
import { InventoryMovementDomainEntity } from '../../domain/entities';

export class GetInventoryMovementsByProductUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly gotInventoryByProductDomainEvent: GotInventoryMovementByProductDomainEvent,
  ) {}

  execute(productId: string): Observable<InventoryMovementDomainEntity[]> {
    return this.inventoryMovement$.findAllByProductId(productId).pipe(
      tap((inventoryMovements: InventoryMovementDomainEntity[]) => {
        this.gotInventoryByProductDomainEvent
          .publish(inventoryMovements)
          .subscribe();
      }),
    );
  }
}
