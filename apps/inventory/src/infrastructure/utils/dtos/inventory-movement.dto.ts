import { IInventoryMovementDomainDto } from 'apps/inventory/src/domain/dtos';
import {
  IsDefined,
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class InventoryMovementDto implements IInventoryMovementDomainDto {
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
  @IsInt()
  quantity: number;

  @IsString()
  @IsDefined()
  @IsIn(['IN', 'OUT'])
  typeMovement: 'IN' | 'OUT';
}
