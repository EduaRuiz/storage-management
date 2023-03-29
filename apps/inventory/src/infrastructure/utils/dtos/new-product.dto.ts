import { IsDefined, IsPositive, IsString } from 'class-validator';
import { INewProductDomainDto } from '../../../domain/dtos';

export class NewProductDto implements INewProductDomainDto {
  @IsString()
  @IsDefined()
  name: string;
  @IsString()
  @IsDefined()
  description: string;
  @IsDefined()
  // @IsNumberString()
  @IsPositive()
  price: number;
}
