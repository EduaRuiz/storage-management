/**
 * DTO de actualización de ubicación
 *
 * @export
 * @interface IUpdateLocationDomainDto
 */
export interface IUpdateLocationDomainDto {
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof IUpdateLocationDomainDto
   */
  _id?: string;
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof IUpdateLocationDomainDto
   */
  name?: string;
  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof IUpdateLocationDomainDto
   */
  description?: string;
  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof IUpdateLocationDomainDto
   */
  address?: string;
}
