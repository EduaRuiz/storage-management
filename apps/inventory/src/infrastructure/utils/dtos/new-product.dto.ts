import { IsDefined, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { INewProductDomainDto } from '../../../domain/dtos';

export class NewProductDto implements INewProductDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description: string;
  @IsDefined()
  @IsPositive()
  price: number;
}
