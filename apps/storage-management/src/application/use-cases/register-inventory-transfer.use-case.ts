import { Observable, forkJoin, iif, map, switchMap, throwError } from 'rxjs';
import { IInventoryTransferDomainDto } from '../../domain/dtos';
import { RegisteredInventoryTransferDomainEvent } from '../../domain/events/publishers';
import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  InventoryTransferDomainModel,
  LocationDomainModel,
  StockDomainModel,
} from '../../domain/models';
import {
  IInventoryTransferDomainService,
  ILocationDomainService,
  IProductExistDomainService,
  IStockDomainService,
} from '../../domain/services';

/**
 * Caso de uso de registrar transferencia de inventario
 *
 * @export
 * @class RegisterInventoryTransferUseCase
 */
export class RegisterInventoryTransferUseCase {
  /**
   * Crea una instancia de RegisterInventoryTransferUseCase
   *
   * @param {IInventoryTransferDomainService} inventoryTransfer$ Servicio de dominio de transferencia de inventario
   * @param {IStockDomainService} stock$ Servicio de dominio de stock
   * @param {ILocationDomainService} location$ Servicio de dominio de ubicación
   * @param {IProductExistDomainService} productExist$ Servicio de dominio de existencia de producto
   * @param {RegisteredInventoryTransferDomainEvent} registeredInventoryTransferDomainEvent Evento de dominio de transferencia de inventario registrada
   * @memberof RegisterInventoryTransferUseCase
   */
  constructor(
    private readonly inventoryTransfer$: IInventoryTransferDomainService,
    private readonly stock$: IStockDomainService,
    private readonly location$: ILocationDomainService,
    private readonly productExist$: IProductExistDomainService,
    private readonly registeredInventoryTransferDomainEvent: RegisteredInventoryTransferDomainEvent,
  ) {}

  /**
   * Ejecutar caso de uso
   *
   * @param {IInventoryTransferDomainDto} dto Dto de transferencia de inventario
   * @param {string} token Token de usuario
   * @return {Observable<InventoryTransferDomainModel>} Observable de transferencia de inventario
   * @memberof RegisterInventoryTransferUseCase
   */
  execute(
    dto: IInventoryTransferDomainDto,
    token: string,
  ): Observable<InventoryTransferDomainModel> {
    return this.productExist$.exist(dto.productId, token).pipe(
      catchError((error) => {
        throw new NotFoundException('Product not found', error.message);
      }),
      switchMap(() => this.validateLocationAndStock(dto)),
      switchMap(() => this.createEntity(dto)),
      switchMap((entity: InventoryTransferDomainModel) => {
        return this.inventoryTransfer$.generateTransfer(entity).pipe(
          tap((entity: InventoryTransferDomainModel) => {
            this.registeredInventoryTransferDomainEvent.publish(entity);
          }),
        );
      }),
    );
  }

  /**
   * Validar ubicación y stock
   *
   * @private
   * @param {IInventoryTransferDomainDto} dto Dto de transferencia de inventario
   * @return {Observable<boolean>} Observable de booleano
   * @memberof RegisterInventoryTransferUseCase
   */
  private validateLocationAndStock(
    dto: IInventoryTransferDomainDto,
  ): Observable<boolean> {
    return this.location$.getLocationById(dto.locationInId).pipe(
      switchMap(() => {
        return this.location$
          .getLocationById(dto.locationOutId)
          .pipe(switchMap(() => this.validateStock(dto)));
      }),
    );
  }

  /**
   * Validar stock y crear stock si no existe
   *
   * @private
   * @param {IInventoryTransferDomainDto} dto Dto de transferencia de inventario
   * @return {Observable<boolean>} Observable de booleano
   * @memberof RegisterInventoryTransferUseCase
   */
  private validateStock(dto: IInventoryTransferDomainDto): Observable<boolean> {
    return this.validateIfStockIsEnough(
      dto.locationOutId,
      dto.productId,
      dto.quantity,
    ).pipe(
      switchMap((isEnough: boolean) => {
        return iif(
          () => isEnough,
          this.validateStockExist(dto).pipe(
            catchError((error) => {
              throw error;
            }),
          ),
          throwError(() => new BadRequestException('Stock is not enough')),
        );
      }),
    );
  }

  /**
   * Validar si el stock es suficiente para la transferencia
   *
   * @private
   * @param {string} locationId Id de ubicación
   * @param {string} productId Id de producto
   * @param {number} quantity Cantidad de producto
   * @return {Observable<boolean>} Observable de booleano
   * @memberof RegisterInventoryTransferUseCase
   */
  private validateIfStockIsEnough(
    locationId: string,
    productId: string,
    quantity: number,
  ): Observable<boolean> {
    return this.stock$
      .findOneByLocationIdAndProductId(locationId, productId)
      .pipe(
        map((stock: StockDomainModel) => {
          return stock.quantity >= quantity;
        }),
      );
  }

  /**
   * Validar si el stock existe y crearlo si no existe
   *
   * @private
   * @param {IInventoryTransferDomainDto} dto Dto de transferencia de inventario
   * @return {Observable<boolean>} Observable de booleano
   * @memberof RegisterInventoryTransferUseCase
   */
  private validateStockExist(
    dto: IInventoryTransferDomainDto,
  ): Observable<boolean> {
    return this.stock$
      .findOneByLocationIdAndProductId(dto.locationInId, dto.productId)
      .pipe(
        catchError(() => {
          return this.createStockIn(dto.locationInId, dto.productId);
        }),
        map(() => true),
      );
  }

  /**
   * Crear entidad de transferencia de inventario
   *
   * @private
   * @param {IInventoryTransferDomainDto} dto Dto de transferencia de inventario
   * @return {Observable<InventoryTransferDomainModel>} Observable de transferencia de inventario
   * @memberof RegisterInventoryTransferUseCase
   */
  private createEntity(
    dto: IInventoryTransferDomainDto,
  ): Observable<InventoryTransferDomainModel> {
    return forkJoin({
      stockIn: this.stock$.findOneByLocationIdAndProductId(
        dto.locationInId,
        dto.productId,
      ),
      stockOut: this.stock$.findOneByLocationIdAndProductId(
        dto.locationOutId,
        dto.productId,
      ),
    }).pipe(
      map(({ stockIn, stockOut }) => ({
        dateTime: new Date(),
        quantity: dto.quantity,
        stockIn,
        stockOut,
      })),
    );
  }

  /**
   * Crear stock en ubicación de entrada
   *
   * @private
   * @param {string} locationId Id de ubicación
   * @param {string} productId Id de producto
   * @return {Observable<StockDomainModel>} Observable de stock
   * @memberof RegisterInventoryTransferUseCase
   */
  private createStockIn(
    locationId: string,
    productId: string,
  ): Observable<StockDomainModel> {
    return this.location$.getLocationById(locationId).pipe(
      switchMap((location: LocationDomainModel) => {
        return this.stock$.createStock({
          location,
          quantity: 0,
          productId,
          dateTime: new Date(),
        });
      }),
    );
  }
}
