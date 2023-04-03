import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de swagger para la ubicación
 *
 * @export
 * @class LocationSwaggerEntity
 */
export class LocationSwaggerEntity {
  /**
   * Identificador de la ubicación
   *
   * @type {number}
   * @memberof LocationSwaggerEntity
   */
  @ApiProperty()
  _id: number;
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof LocationSwaggerEntity
   */
  @ApiProperty()
  name: string;

  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof LocationSwaggerEntity
   */
  @ApiProperty()
  description: string;

  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof LocationSwaggerEntity
   */
  @ApiProperty()
  address: string;
}
