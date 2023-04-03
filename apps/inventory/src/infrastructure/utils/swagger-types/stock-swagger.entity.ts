import { ApiProperty } from '@nestjs/swagger';
import { ProductSwaggerEntity } from '.';

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
   * Identificador del ubicación
   *
   * @type {string}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  locationId: string;

  /**
   * Producto
   *
   * @type {ProductSwaggerEntity}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  product: ProductSwaggerEntity;

  /**
   * Fecha y hora del stock
   *
   * @type {Date}
   * @memberof StockSwaggerEntity
   */
  @ApiProperty()
  dateTime: Date;
}
