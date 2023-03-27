import { IsDefined, IsPositive, IsString } from 'class-validator';

export class NewProductDto {
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
