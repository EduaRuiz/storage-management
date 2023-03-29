import { Observable, tap } from 'rxjs';
import { GotInventoryMovementByProductDomainEvent } from '../../domain/events/publishers';
import { IInventoryMovementDomainService } from '../../domain/services';
import { InventoryMovementDomainModel } from '../../domain/models';

export class GetInventoryMovementsByProductUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly gotInventoryByProductDomainEvent: GotInventoryMovementByProductDomainEvent,
  ) {}

  execute(productId: string): Observable<InventoryMovementDomainModel[]> {
    return this.inventoryMovement$.findAllByProductId(productId).pipe(
      tap((inventoryMovements: InventoryMovementDomainModel[]) => {
        this.gotInventoryByProductDomainEvent
          .publish(inventoryMovements)
          .subscribe();
      }),
    );
  }
}
