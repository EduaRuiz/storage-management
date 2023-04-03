/**
 * Interfaz que representa la estructura de un producto existente
 *
 * @export
 * @interface IProductExist
 */
export interface IProductExist {
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof IProductExist
   */
  _id: string;
  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof IProductExist
   */
  name: string;
  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof IProductExist
   */
  description: string;
  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof IProductExist
   */
  price: number;
}
