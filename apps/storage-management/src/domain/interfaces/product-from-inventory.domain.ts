/**
 * Interfaz que representa la estructura de un producto existente
 *
 * @export
 * @interface IProductFromInventoryDomain
 */
export interface IProductFromInventoryDomain {
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof IProductFromInventoryDomain
   */
  _id: string;
  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof IProductFromInventoryDomain
   */
  name: string;
  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof IProductFromInventoryDomain
   */
  description: string;
  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof IProductFromInventoryDomain
   */
  price: number;
}
