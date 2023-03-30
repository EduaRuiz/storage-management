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

export class RegisterInventoryTransferUseCase {
  constructor(
    private readonly inventoryTransfer$: IInventoryTransferDomainService,
    private readonly stock$: IStockDomainService,
    private readonly location$: ILocationDomainService,
    private readonly productExist$: IProductExistDomainService,
    private readonly registeredInventoryTransferDomainEvent: RegisteredInventoryTransferDomainEvent,
  ) {}

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
            this.registeredInventoryTransferDomainEvent
              .publish(entity)
              .subscribe();
          }),
        );
      }),
    );
  }

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
