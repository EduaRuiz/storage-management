/**
 * @description Interfaz que representa la respuesta de la consulta de existencia de una ubicación
 *
 * @export
 * @interface ILocationFromStorageDomain
 */
export interface ILocationFromStorageDomain {
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof ILocationFromStorageDomain
   */
  _id: string;
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof ILocationFromStorageDomain
   */
  name: string;
  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof ILocationFromStorageDomain
   */
  description: string;
  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof ILocationFromStorageDomain
   */
  address: string;
}
