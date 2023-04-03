/**
 * @description Dto de dominio para el movimiento de inventario
 *
 * @export
 * @interface IInventoryMovementDomainDto
 */
export interface IInventoryMovementDomainDto {
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof IInventoryMovementDomainDto
   */
  productId: string;
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof IInventoryMovementDomainDto
   */
  locationId: string;
  /**
   * Cantidad de productos
   *
   * @type {number}
   * @memberof IInventoryMovementDomainDto
   */
  quantity: number;
  /**
   * Tipo de movimiento
   *
   * @type {('IN' | 'OUT')} IN: Entrada, OUT: Salida
   * @memberof IInventoryMovementDomainDto
   */
  typeMovement: 'IN' | 'OUT';
}
