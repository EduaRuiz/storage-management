/**
 * @description Dto de dominio para el registro de un nuevo producto
 *
 * @export
 * @interface INewProductDomainDto
 */
export interface INewProductDomainDto {
  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof INewProductDomainDto
   */
  name: string;
  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof INewProductDomainDto
   */
  description: string;
  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof INewProductDomainDto
   */
  price: number;
}
