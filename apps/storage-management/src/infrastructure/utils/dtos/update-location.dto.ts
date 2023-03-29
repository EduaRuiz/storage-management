import { MaxLength } from 'class-validator';
import { IsDefined, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationId is not valid',
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
  @IsString()
  @IsDefined()
  @MaxLength(100)
  address?: string;
}
