import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NewLocationDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  description: string;
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string;
}
