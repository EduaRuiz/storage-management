import { ApiProperty } from '@nestjs/swagger';
import { StockSwaggerEntity } from '.';

/**
 * Entidad de swagger para el inventario de transferencia
 *
 * @export
 * @class InventoryTransferSwaggerEntity
 */
export class InventoryTransferSwaggerEntity {
  /**
   * Identificador del inventario de transferencia
   *
   * @type {number}
   * @memberof InventoryTransferSwaggerEntity
   */
  @ApiProperty()
  _id: number;

  /**
   * Cantidad de transferencia
   *
   * @type {number}
   * @memberof InventoryTransferSwaggerEntity
   */
  @ApiProperty()
  quantity: number;

  /**
   * Stock de entrada
   *
   * @type {object}
   * @memberof InventoryTransferSwaggerEntity
   */
  @ApiProperty()
  stockIn: StockSwaggerEntity;

  /**
   * Stock de salida
   *
   * @type {object}
   * @memberof InventoryTransferSwaggerEntity
   */
  @ApiProperty()
  stockOut: StockSwaggerEntity;

  /**
   * Fecha y hora de la transferencia
   *
   * @type {Date}
   * @memberof InventoryTransferSwaggerEntity
   */
  @ApiProperty()
  dateTime: Date;
}
