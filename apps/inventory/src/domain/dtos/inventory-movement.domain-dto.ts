export interface IInventoryMovementDomainDto {
  productId: string;
  locationId: string;
  quantity: number;
  typeMovement: 'IN' | 'OUT';
}
