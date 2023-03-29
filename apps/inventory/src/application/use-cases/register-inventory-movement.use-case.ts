import { IInventoryMovementDomainDto } from '../../domain/dtos';
import { StockDomainModel } from '../../domain/models';
import { InventoryMovementDomainModel } from '../../domain/models';

import {
  IInventoryMovementDomainService,
  ILocationExistDomainService,
  IStockDomainService,
} from '../../domain/services';
import { Observable, of, switchMap, tap } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisteredInventoryMovementDomainEvent } from '../../domain/events/publishers';
import { catchError } from 'rxjs/operators';

export class RegisterInventoryMovementUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly stock$: IStockDomainService,
    private readonly locationExist$: ILocationExistDomainService,
    private readonly registeredInventoryMovementDomainEvent: RegisteredInventoryMovementDomainEvent,
  ) {}

  execute(
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<InventoryMovementDomainModel> {
    const locationExists = this.locationExist$
      .exist(inventoryMovementDto.locationId)
      .pipe(
        catchError((error) => {
          throw new NotFoundException('Location not found', error.message);
        }),
        switchMap(() => {
          return this.getStock(inventoryMovementDto).pipe(
            switchMap((stock: StockDomainModel | null) => {
              return this.stockLogic(stock, inventoryMovementDto);
            }),
          );
        }),
      );

    return locationExists.pipe(
      switchMap((stock: StockDomainModel) => {
        return this.updateStock(stock, inventoryMovementDto).pipe(
          switchMap((stock: StockDomainModel) => {
            return this.inventoryMovement$
              .create({
                quantity: inventoryMovementDto.quantity,
                typeMovement: inventoryMovementDto.typeMovement,
                dateTime: new Date(),
              })
              .pipe(
                tap((inventoryMovement: InventoryMovementDomainModel) => {
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
  ): Observable<StockDomainModel> {
    return this.stock$.findByProductIdAndLocationId(
      inventoryMovementDto.productId,
      inventoryMovementDto.locationId,
    );
  }

  private createStock(
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainModel> {
    return this.stock$.createStock({
      quantity: inventoryMovementDto.quantity,
      locationId: inventoryMovementDto.locationId,
      dateTime: new Date(),
    });
  }

  private stockLogic(
    stock: StockDomainModel,
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainModel> {
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
    stock: StockDomainModel,
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainModel> {
    if (inventoryMovementDto.typeMovement === 'IN') {
      stock.quantity += inventoryMovementDto.quantity;
    } else {
      stock.quantity -= inventoryMovementDto.quantity;
    }
    return this.stock$.updateQuantity(stock._id, stock);
  }
}
