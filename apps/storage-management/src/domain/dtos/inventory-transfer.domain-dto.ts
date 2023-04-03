/**
 * DTO de transferencia de inventario
 *
 * @export
 * @interface IInventoryTransferDomainDto
 */
export interface IInventoryTransferDomainDto {
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof IInventoryTransferDomainDto
   */
  productId: string;
  /**
   * Identificador de la ubicación de entrada
   *
   * @type {string}
   * @memberof IInventoryTransferDomainDto
   */
  locationInId: string;
  /**
   * Identificador de la ubicación de salida
   *
   * @type {string}
   * @memberof IInventoryTransferDomainDto
   */
  locationOutId: string;
  /**
   * Cantidad de transferencia
   *
   * @type {number}
   * @memberof IInventoryTransferDomainDto
   */
  quantity: number;
}
