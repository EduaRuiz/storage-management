import { IsDefined, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { INewProductDomainDto } from '../../../domain/dtos';

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
  description: string;

  /**
   * Precio del producto
   *
   * @type {number}
   * @memberof NewProductDto
   */
  @IsDefined()
  @IsPositive()
  price: number;
}
