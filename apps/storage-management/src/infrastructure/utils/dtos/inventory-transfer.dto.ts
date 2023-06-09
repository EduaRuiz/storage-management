import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

/**
 * DTO para transferencia de inventario
 *
 * @export
 * @class InventoryTransferDto
 */
export class InventoryTransferDto {
  /**
   * Id del producto
   *
   * @type {string}
   * @memberof InventoryTransferDto
   */
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  @ApiProperty()
  productId: string;

  /**
   * Id de la ubicación de entrada
   *
   * @type {string}
   * @memberof InventoryTransferDto
   */
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationInId is not valid',
  })
  @ApiProperty()
  locationInId: string;

  /**
   * Id de la ubicación de salida
   *
   * @type {string}
   * @memberof InventoryTransferDto
   */
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationOutId is not valid',
  })
  @ApiProperty()
  locationOutId: string;

  /**
   * Cantidad a transferir
   *
   * @type {number}
   * @memberof InventoryTransferDto
   */
  @IsDefined()
  @IsPositive()
  @IsInt()
  @ApiProperty()
  quantity: number;
}
