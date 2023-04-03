/**
 * Interfaz que representa la respuesta de la consulta de existencia de una ubicación
 *
 * @export
 * @interface ILocationExist
 */
export interface ILocationExist {
  /**
   * Identificador de la ubicación
   *
   * @type {string}
   * @memberof ILocationExist
   */
  _id: string;
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof ILocationExist
   */
  name: string;
  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof ILocationExist
   */
  description: string;
  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof ILocationExist
   */
  address: string;
}
