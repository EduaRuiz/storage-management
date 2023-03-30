import { Observable, tap } from 'rxjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  Headers,
  UseGuards,
} from '@nestjs/common';
import {
  InventoryTransferService,
  LocationService,
  StockService,
} from '../persistance/services/';
import {
  InventoryTransferDto,
  NewLocationDto,
  UpdateLocationDto,
} from '../utils/dtos';
import {
  GotInventoryTransferByProductPublisher,
  GotInventoryTransferByLocationPublisher,
  RegisteredInventoryTransferPublisher,
  RegisteredNewLocationPublisher,
  UpdatedLocationInfoPublisher,
  GotLocationInfoPublisher,
} from '../messaging/publishers';
import { LocationModel } from '../persistance/models';
import {
  GetLocationInfoUseCase,
  RegisterInventoryTransferUseCase,
} from '../../application/use-cases';
import { GotLocationInfoDomainEvent } from '../../domain/events/publishers/got-location-info.domain-event';
import {
  InventoryTransferDomainModel,
  LocationDomainModel,
} from '../../domain/models';
import { RegisterNewLocationUseCase } from '../../application/use-cases/register-new-location.use-case';
import { ProductExistService } from '../utils/services';
import { MongoServerErrorExceptionFilter } from '../utils/exception-filters';
import { AuthGuard } from '@nestjs/passport';

@Controller('storage')
// @UseFilters(MongoServerErrorExceptionFilter)
export class StorageController {
  constructor(
    private readonly locationService: LocationService,
    private readonly stockService: StockService,
    private readonly inventoryTransferService: InventoryTransferService,
    private readonly productExistService: ProductExistService,
    private readonly registeredNewLocationPublisher: RegisteredNewLocationPublisher,
    private readonly updatedLocationInfoPublisher: UpdatedLocationInfoPublisher,
    private readonly gotLocationInfoPublisher: GotLocationInfoPublisher,
    private readonly gotStocksByLocationPublisher: GotInventoryTransferByLocationPublisher,
    private readonly gotStocksByProductPublisher: GotInventoryTransferByProductPublisher,
    private readonly registeredInventoryTransferPublisher: RegisteredInventoryTransferPublisher,
    private readonly gotInventoryTransferByLocationPublisher: GotInventoryTransferByLocationPublisher,
  ) {}

  @UseGuards(AuthGuard())
  @Post('location/create')
  registerNewLocation(
    @Body() newLocationDto: NewLocationDto,
  ): Observable<LocationDomainModel> {
    const registerNewLocationUseCase = new RegisterNewLocationUseCase(
      this.locationService,
      this.registeredNewLocationPublisher,
    );
    return registerNewLocationUseCase.execute(newLocationDto);
  }

  @UseGuards(AuthGuard())
  @Get('location/info/:_id')
  getLocationInfo(
    @Param('_id') locationId: string,
  ): Observable<LocationDomainModel> {
    const getLocationInfoUseCase = new GetLocationInfoUseCase(
      this.locationService,
      this.gotLocationInfoPublisher,
    );
    return getLocationInfoUseCase.execute(locationId);
  }

  @UseGuards(AuthGuard())
  @Put('location/update/:_id')
  updateLocation(
    @Body() updateLocationDto: UpdateLocationDto,
    @Param('_id') locationId: string,
  ): Observable<LocationModel> {
    return this.locationService
      .updateLocation(locationId, updateLocationDto as LocationModel)
      .pipe(
        tap((location: LocationModel) => {
          this.updatedLocationInfoPublisher.publish(location);
        }),
      );
  }

  @UseGuards(AuthGuard())
  @Post('inventory-transfer/register')
  registerInventoryTransfer(
    @Headers('authorization') authHeader: string,
    @Body() inventoryTransferDto: InventoryTransferDto,
  ): Observable<InventoryTransferDomainModel> {
    const token = authHeader?.split(' ')[1];
    const registerInventoryTransferUseCase =
      new RegisterInventoryTransferUseCase(
        this.inventoryTransferService,
        this.stockService,
        this.locationService,
        this.productExistService,
        this.registeredInventoryTransferPublisher,
      );
    return registerInventoryTransferUseCase.execute(
      inventoryTransferDto,
      token,
    );
  }
}
