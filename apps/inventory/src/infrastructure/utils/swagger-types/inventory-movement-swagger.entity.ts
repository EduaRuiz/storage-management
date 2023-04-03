import { ApiProperty } from '@nestjs/swagger';
import { StockSwaggerEntity } from '.';

/**
 * Entidad de swagger para el inventario
 *
 * @export
 * @class InventoryMovementSwaggerEntity
 */
export class InventoryMovementSwaggerEntity {
  /**
   * Identificador del inventario
   *
   * @type {number}
   * @memberof InventoryMovementSwaggerEntity
   */
  @ApiProperty()
  _id: number;

  /**
   * Cantidad
   *
   * @type {number}
   * @memberof InventoryMovementSwaggerEntity
   */
  @ApiProperty()
  quantity: number;

  /**
   * Stock
   *
   * @type {object}
   * @memberof InventoryMovementSwaggerEntity
   */
  @ApiProperty()
  stock: StockSwaggerEntity;

  /**
   * Tipo de movimiento de inventario (IN: Entrada, OUT: Salida)
   *
   * @type {('IN' | 'OUT')}
   * @memberof InventoryMovementSwaggerEntity
   */
  @ApiProperty()
  typeMovement: 'IN' | 'OUT';

  /**
   * Fecha y hora del movimiento de inventario
   *
   * @type {Date}
   * @memberof InventoryMovementSwaggerEntity
   */
  @ApiProperty()
  dateTime: Date;
}
