import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO para crear una nueva ubicación
 *
 * @export
 * @class NewLocationDto
 */
export class NewLocationDto {
  /**
   * Nombre de la ubicación
   *
   * @type {string}
   * @memberof NewLocationDto
   */
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  /**
   * Descripción de la ubicación
   *
   * @type {string}
   * @memberof NewLocationDto
   */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  description: string;

  /**
   * Dirección de la ubicación
   *
   * @type {string}
   * @memberof NewLocationDto
   */
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  address: string;
}
