import { IInventoryMovementDomainDto } from '../../domain/dtos';
import { StockDomainModel } from '../../domain/models';
import { InventoryMovementDomainModel } from '../../domain/models';

import {
  IInventoryMovementDomainService,
  ILocationExistDomainService,
  IProductDomainService,
  IStockDomainService,
} from '../../domain/services';
import { Observable, switchMap, iif, throwError, catchError, tap } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisteredInventoryMovementDomainEvent } from '../../domain/events/publishers';

export class RegisterInventoryMovementUseCase {
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly stock$: IStockDomainService,
    private readonly product$: IProductDomainService,
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
          console.log(error);
          throw new NotFoundException('Location not found', error.message);
        }),
        switchMap(() =>
          this.stock$.findByProductIdAndLocationId(
            inventoryMovementDto.locationId,
            inventoryMovementDto.productId,
          ),
        ),
        catchError((error) =>
          iif(
            () => inventoryMovementDto.typeMovement === 'IN',
            this.createStock(inventoryMovementDto),
            throwError(
              new BadRequestException('No stock to remove', error.message),
            ),
          ),
        ),
      );

    return locationExists.pipe(
      catchError((error) => throwError(error)),
      switchMap((stock: StockDomainModel) =>
        iif(
          () =>
            inventoryMovementDto.typeMovement === 'OUT' &&
            stock.quantity < inventoryMovementDto.quantity,
          throwError(new BadRequestException('No stock to remove')),
          this.inventoryMovement$
            .create({
              quantity: inventoryMovementDto.quantity,
              typeMovement: inventoryMovementDto.typeMovement,
              dateTime: new Date(),
              stock,
            })
            .pipe(
              tap((inventoryMovement: InventoryMovementDomainModel) => {
                this.registeredInventoryMovementDomainEvent
                  .publish(inventoryMovement)
                  .subscribe();
              }),
            ),
        ),
      ),
    );
  }

  private createStock(
    inventoryMovementDto: IInventoryMovementDomainDto,
  ): Observable<StockDomainModel> {
    return this.product$.findOneById(inventoryMovementDto.productId).pipe(
      catchError((error) => {
        throw error;
      }),
      switchMap((product) => {
        return this.stock$.createStock({
          quantity: inventoryMovementDto.quantity,
          locationId: inventoryMovementDto.locationId,
          dateTime: new Date(),
          product,
        });
      }),
    );
  }
}
