import {
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class InventoryTransferDto {
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  productId: string;

  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationInId is not valid',
  })
  locationInId: string;
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationOutId is not valid',
  })
  locationOutId: string;
  @IsDefined()
  @IsPositive()
  @IsInt()
  quantity: number;
}
