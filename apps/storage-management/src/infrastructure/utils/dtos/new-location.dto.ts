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
  address: string;
}
