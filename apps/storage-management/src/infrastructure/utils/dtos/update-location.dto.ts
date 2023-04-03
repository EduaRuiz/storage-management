import { MaxLength, IsNotEmpty } from 'class-validator';
import { IsDefined, IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO para actualizar una ubicación
 *
 * @export
 * @class UpdateLocationDto
 */
export class UpdateLocationDto {
  /**
   * Id de la ubicación
   *
   * @type {string}
   * @memberof UpdateLocationDto
   */
  @IsOptional()
  @IsString()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationId is not valid',
  })
  _id?: string;

  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof UpdateLocationDto
   */
  @IsOptional()
  @IsString()
  @IsDefined()
  name?: string;

  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof UpdateLocationDto
   */
  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description?: string;

  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof UpdateLocationDto
   */
  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  address?: string;
}
