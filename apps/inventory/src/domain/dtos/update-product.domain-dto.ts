/**
 * @description Dto de dominio para la actualización de un producto
 *
 * @export
 * @interface IUpdateProductDomainDto
 */
export interface IUpdateProductDomainDto {
  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof IUpdateProductDomainDto
   */
  _id?: string;
  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof IUpdateProductDomainDto
   */
  name?: string;
  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof IUpdateProductDomainDto
   */
  description?: string;
  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof IUpdateProductDomainDto
   */
  price?: number;
}
