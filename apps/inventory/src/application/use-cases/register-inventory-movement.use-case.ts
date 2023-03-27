import { IInventoryMovementDomainDto } from '../../domain/dto';
import { StockDomainEntity } from '../../domain/entities/stock.domain-entity';
import { InventoryMovementDomainEntity } from '../../domain/entities';

import {
  IInventoryMovementDomainService,
  IStockDomainService,
} from '../../domain/services';
import { Observable, of, switchMap, tap } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { RegisteredInventoryMovementDomainEvent } from '../../domain/events/publishers/registered-inventory-movement.domain-event';

export class RegisterInventoryMovementUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly stock$: IStockDomainService,
    private readonly registeredInventoryMovementDomainEvent: RegisteredInventoryMovementDomainEvent,
  ) {}

  execute(
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<InventoryMovementDomainEntity> {
    const currentStock = this.getStock(inventoryMovementDto).pipe(
      switchMap((stock: StockDomainEntity | null) => {
        return this.stockLogic(stock, inventoryMovementDto);
      }),
    );
    return currentStock.pipe(
      switchMap((stock: StockDomainEntity) => {
        return this.updateStock(stock, inventoryMovementDto).pipe(
          switchMap((stock: StockDomainEntity) => {
            return this.inventoryMovement$
              .create(stock._id, {
                quantity: inventoryMovementDto.quantity,
                typeMovement: inventoryMovementDto.typeMovement,
                dateTime: new Date(),
              })
              .pipe(
                tap((inventoryMovement: InventoryMovementDomainEntity) => {
                  this.registeredInventoryMovementDomainEvent.publish(
                    inventoryMovement,
                  );
                }),
              );
          }),
        );
      }),
    );
  }

  private getStock(
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainEntity> {
    return this.stock$.findByProductIdAndLocationId(
      inventoryMovementDto.productId,
      inventoryMovementDto.locationId,
    );
  }

  private createStock(
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainEntity> {
    return this.stock$.createStock(inventoryMovementDto.productId, {
      quantity: inventoryMovementDto.quantity,
      locationId: inventoryMovementDto.locationId,
      dateTime: new Date(),
    });
  }

  private stockLogic(
    stock: StockDomainEntity,
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainEntity> {
    if (stock === null || stock === undefined) {
      if (inventoryMovementDto.typeMovement === 'OUT') {
        throw new BadRequestException('No stock to remove');
      }
      return this.createStock(inventoryMovementDto);
    } else {
      if (
        inventoryMovementDto.typeMovement === 'OUT' &&
        inventoryMovementDto.quantity > stock.quantity
      ) {
        throw new BadRequestException('stock is not enough');
      } //throw error
      return of(stock);
    }
  }

  private updateStock(
    stock: StockDomainEntity,
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainEntity> {
    if (inventoryMovementDto.typeMovement === 'IN') {
      stock.quantity += inventoryMovementDto.quantity;
    } else {
      stock.quantity -= inventoryMovementDto.quantity;
    }
    return this.stock$.updateQuantity(stock._id, stock);
  }
}
