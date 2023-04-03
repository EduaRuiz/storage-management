import { ApiProperty } from '@nestjs/swagger';
import { IUpdateProductDomainDto } from 'apps/inventory/src/domain/dtos';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

/**
 * DTO de actualización de producto
 *
 * @export
 * @class UpdateProductDto
 * @implements {IUpdateProductDomainDto}
 */
export class UpdateProductDto implements IUpdateProductDomainDto {
  /**
   * Id del producto
   *
   * @type {string}
   * @memberof UpdateProductDto
   */
  @IsOptional()
  @IsString()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  @ApiProperty()
  _id?: string;

  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof UpdateProductDto
   */
  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof UpdateProductDto
   */
  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  description?: string;

  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof UpdateProductDto
   */
  @IsOptional()
  @IsDefined()
  @IsPositive()
  @ApiProperty()
  price?: number;
}
