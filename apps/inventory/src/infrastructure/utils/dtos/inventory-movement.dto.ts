import {
  IsDefined,
  IsIn,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class InventoryMovementDto {
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'ProductId is not valid',
  })
  productId: string;
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i), {
    message: 'LocationId is not valid',
  })
  locationId: string;
  @IsDefined()
  @IsPositive()
  quantity: number;
  @IsString()
  @IsDefined()
  @IsIn(['IN', 'OUT'])
  typeMovement: 'IN' | 'OUT';
}
