import { IInventoryMovementDomainDto } from 'apps/inventory/src/domain/dtos';
import {
  IsDefined,
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

/**
 * DTO de movimiento de inventario
 *
 * @export
 * @class InventoryMovementDto
 * @implements {IInventoryMovementDomainDto}
 */
export class InventoryMovementDto implements IInventoryMovementDomainDto {
  /**
   * Id de producto
   *
   * @type {string}
   * @memberof InventoryMovementDto
   */
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  productId: string;

  /**
   * Id de ubicación
   *
   * @type {string}
   * @memberof InventoryMovementDto
   */
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationId is not valid',
  })
  locationId: string;

  /**
   * Cantidad de movimiento
   *
   * @type {number}
   * @memberof InventoryMovementDto
   */
  @IsDefined()
  @IsPositive()
  @IsInt()
  quantity: number;

  /**
   * Tipo de movimiento
   *
   * @type {('IN' | 'OUT')} 'IN' | 'OUT'
   * @memberof InventoryMovementDto
   */
  @IsString()
  @IsDefined()
  @IsIn(['IN', 'OUT'])
  typeMovement: 'IN' | 'OUT';
}
