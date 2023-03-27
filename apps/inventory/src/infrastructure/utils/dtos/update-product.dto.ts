import {
  IsDefined,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  _id?: string;
  @IsOptional()
  @IsString()
  @IsDefined()
  name?: string;
  @IsOptional()
  @IsString()
  @IsDefined()
  description?: string;
  @IsOptional()
  @IsDefined()
  @IsPositive()
  price?: number;
}
