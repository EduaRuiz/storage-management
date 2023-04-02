import { IUpdateProductDomainDto } from 'apps/inventory/src/domain/dtos';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateProductDto implements IUpdateProductDomainDto {
  @IsOptional()
  @IsString()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  _id?: string;
  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name?: string;
  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description?: string;
  @IsOptional()
  @IsDefined()
  @IsPositive()
  price?: number;
}
