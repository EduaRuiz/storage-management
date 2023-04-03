import { ApiProperty } from '@nestjs/swagger';
import { LocationSwaggerEntity } from '.';

/**
 * Entidad de swagger para el stock
 *
 * @export
 * @class StockSwaggerEntity
 */
export class StockSwaggerEntity {
  /**
   * Identificador del stock
   *
   * @type {number}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  _id: number;

  /**
   * Cantidad de stock
   *
   * @type {number}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  quantity: number;

  /**
   * Identificador del producto
   *
   * @type {string}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  productId: string;

  /**
   * Ubicación del stock
   *
   * @type {LocationSwaggerEntity}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  location: LocationSwaggerEntity;

  /**
   * Fecha y hora del stock
   *
   * @type {Date}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  dateTime: Date;
}
