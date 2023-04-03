import { Observable } from 'rxjs';
import { IInventoryMovementDomainService } from '../../domain/services';
import { InventoryMovementDomainModel } from '../../domain/models';

/**
 * Retorna todos los movimientos de inventario por producto
 *
 * @export
 * @class GetInventoryMovementsByProductUseCase
 */
export class GetInventoryMovementsByProductUseCase {
  /**
   * Crea una instancia de GetInventoryMovementsByProductUseCase
   *
   * @param {IInventoryMovementDomainService} inventoryMovement$ Servicio de dominio de movimientos de inventario
   * @memberof GetInventoryMovementsByProductUseCase
   */
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
  ) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {string} productId Identificador del producto
   * @return {Observable<InventoryMovementDomainModel[]>} Observable con los movimientos de inventario
   * @memberof GetInventoryMovementsByProductUseCase
   */
  execute(productId: string): Observable<InventoryMovementDomainModel[]> {
    return this.inventoryMovement$.findAllByProductId(productId).pipe();
  }
}
