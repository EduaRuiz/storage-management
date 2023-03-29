import { IsDefined, IsString, MaxLength } from 'class-validator';

export class NewLocationDto {
  @IsString()
  @IsDefined()
  name: string;
  @IsString()
  @IsDefined()
  description: string;
  @IsDefined()
  @IsString()
  @MaxLength(100)
  address: string;
}
