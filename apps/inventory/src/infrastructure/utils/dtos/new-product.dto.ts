import { IsDefined, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { INewProductDomainDto } from '../../../domain/dtos';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de nuevo producto
 *
 * @export
 * @class NewProductDto
 * @implements {INewProductDomainDto}
 */
export class NewProductDto implements INewProductDomainDto {
  /**
   * Nombre del producto
   *
   * @type {string}
   * @memberof NewProductDto
   */
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  /**
   * Descripción del producto
   *
   * @type {string}
   * @memberof NewProductDto
   */
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof NewProductDto
   */
  @IsDefined()
  @IsPositive()
  @ApiProperty()
  price: number;
}
