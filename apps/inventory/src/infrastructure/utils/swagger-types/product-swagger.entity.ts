import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de swagger para la ubicación
 *
 * @export
 * @class ProductSwaggerEntity
 */
export class ProductSwaggerEntity {
  /**
   * Identificador de la ubicación
   *
   * @type {number}
   * @memberof ProductSwaggerEntity
   */
  @ApiProperty()
  _id: number;
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof ProductSwaggerEntity
   */
  @ApiProperty()
  name: string;

  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof ProductSwaggerEntity
   */
  @ApiProperty()
  description: string;

  /**
   * Dirección de la ubicación
   *
   * @type {number}
   * @memberof ProductSwaggerEntity
   */
  @ApiProperty()
  price: number;
}
