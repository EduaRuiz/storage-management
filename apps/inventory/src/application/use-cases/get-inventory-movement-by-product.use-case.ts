import { Observable } from 'rxjs';
import { IInventoryMovementDomainService } from '../../domain/services';
import { InventoryMovementDomainModel } from '../../domain/models';

export class GetInventoryMovementsByProductUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
  ) {}

  execute(productId: string): Observable<InventoryMovementDomainModel[]> {
    return this.inventoryMovement$.findAllByProductId(productId).pipe();
  }
}
