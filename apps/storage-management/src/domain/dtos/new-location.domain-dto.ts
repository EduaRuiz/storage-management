/**
 * DTO de nueva ubicación
 *
 * @export
 * @interface INewLocationDomainDto
 */
export interface INewLocationDomainDto {
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof INewLocationDomainDto
   */
  name: string;
  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof INewLocationDomainDto
   */
  description: string;
  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof INewLocationDomainDto
   */
  address: string;
}
