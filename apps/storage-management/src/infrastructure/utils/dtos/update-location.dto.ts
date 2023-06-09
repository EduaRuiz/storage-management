import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
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
  @ApiProperty()
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
  @ApiProperty()
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
  @ApiProperty()
  address?: string;
}
