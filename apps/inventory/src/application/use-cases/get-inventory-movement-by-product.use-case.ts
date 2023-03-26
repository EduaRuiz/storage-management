import { IInventoryMovementDomainService } from '../../domain/services';
export class GetInventoryMovementByProductUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly inventoryMovement$: Got,
  ) {}

  async execute(productId: string): Promise<InventoryMovement[]> {
    return this.inventoryMovementRepository.findByProductId(productId);
  }
}
