import { InventoryMovementDomainModel } from '../../models';
import { Observable } from 'rxjs';

/**
 * Evento de dominio de registro de movimiento de inventario
 *
 * @export
 * @abstract
 * @class RegisteredInventoryMovementDomainEvent
 * @template Response
 */
export abstract class RegisteredInventoryMovementDomainEvent<
  Response = InventoryMovementDomainModel,
> {
  /**
   * Publica el evento de dominio
   *
   * @abstract
   * @param {Response} inventoryMovement Movimiento de inventario
   * @return {Observable<Response>} Observable con el movimiento de inventario
   * @memberof RegisteredInventoryMovementDomainEvent
   */
  abstract publish(inventoryMovement: Response): Observable<Response>;
}
