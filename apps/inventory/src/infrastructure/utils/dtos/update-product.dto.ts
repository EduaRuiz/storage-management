import {
  IsDefined,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  _id?: string;
  @IsString()
  @IsDefined()
  name: string;
  @IsString()
  @IsDefined()
  description: string;
  @IsDefined()
  @IsNumberString()
  @IsPositive()
  price: number;
}
