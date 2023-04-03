import { InventoryTransferDomainModel } from '../../models';
import { Observable } from 'rxjs';

/**
 * Evento de dominio de transferencia de inventario registrada
 *
 * @export
 * @abstract
 * @class RegisteredInventoryTransferDomainEvent
 * @template Response
 */
export abstract class RegisteredInventoryTransferDomainEvent<
  Response = InventoryTransferDomainModel,
> {
  /**
   * Publicar evento de dominio
   *
   * @abstract
   * @param {Response} inventoryTransfer Transferencia de inventario
   * @return {Observable<Response>} Observable de transferencia de inventario
   * @memberof RegisteredInventoryTransferDomainEvent
   */
  abstract publish(inventoryTransfer: Response): Observable<Response>;
}
