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

/**
 * Registra un movimiento de inventario
 *
 * @export
 * @class RegisterInventoryMovementUseCase
 */
export class RegisterInventoryMovementUseCase {
  /**
   *
   * Crea un stock
   *
   * @param {IInventoryMovementDomainService} inventoryMovement$ Servicio de dominio de movimientos de inventario
   * @param {IStockDomainService} stock$ Servicio de dominio de stocks
   * @param {IProductDomainService} product$ Servicio de dominio de productos
   * @param {ILocationExistDomainService} locationExist$ Servicio de dominio de existencia de ubicaciones
   * @param {RegisteredInventoryMovementDomainEvent} registeredInventoryMovementDomainEvent Evento de dominio de registro de movimiento de inventario
   * @memberof RegisterInventoryMovementUseCase
   */
  constructor(
    private readonly inventoryMovement$: IInventoryMovementDomainService,
    private readonly stock$: IStockDomainService,
    private readonly product$: IProductDomainService,
    private readonly locationExist$: ILocationExistDomainService,
    private readonly registeredInventoryMovementDomainEvent: RegisteredInventoryMovementDomainEvent,
  ) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {IInventoryMovementDomainDto} inventoryMovementDto Datos del movimiento de inventario
   * @param {string} token Token de autenticación
   * @return {Observable<InventoryMovementDomainModel>} Observable con el movimiento de inventario
   * @memberof RegisterInventoryMovementUseCase
   */
  execute(
    inventoryMovementDto: IInventoryMovementDomainDto,
    token: string,
  ): Observable<InventoryMovementDomainModel> {
    const locationExists = this.locationExist$
      .exist(inventoryMovementDto.locationId, token)
      .pipe(
        catchError((error) => {
          throw new NotFoundException('Location not found', error.message);
        }),
        switchMap(() =>
          this.stock$
            .findByProductIdAndLocationId(
              inventoryMovementDto.productId,
              inventoryMovementDto.locationId,
            )
            .pipe(
              catchError((error) =>
                iif(
                  () => inventoryMovementDto.typeMovement === 'IN',
                  this.createStock(inventoryMovementDto),
                  throwError(
                    new BadRequestException(
                      'No stock to remove',
                      error.message,
                    ),
                  ),
                ),
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
                this.registeredInventoryMovementDomainEvent.publish(
                  inventoryMovement,
                );
              }),
            ),
        ),
      ),
    );
  }

  /**
   * Crea un stock
   *
   * @private
   * @param {IInventoryMovementDomainDto} inventoryMovementDto Datos del movimiento de inventario
   * @return  {Observable<StockDomainModel>} Observable con el stock
   * @memberof RegisterInventoryMovementUseCase
   */
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
