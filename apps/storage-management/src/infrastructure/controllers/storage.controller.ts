import { Observable } from 'rxjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
  RegisteredInventoryTransferPublisher,
  RegisteredNewLocationPublisher,
  UpdatedLocationInfoPublisher,
} from '../messaging/publishers';
import {
  GetLocationInfoUseCase,
  RegisterInventoryTransferUseCase,
  RegisterNewLocationUseCase,
  UpdateLocationInfoUseCase,
} from '../../application/use-cases';
import {
  InventoryTransferDomainModel,
  LocationDomainModel,
} from '../../domain/models';
import { ProductExistService } from '../utils/services';
import { JwtGuard } from '../utils/guards';

/**
 * Controlador de almacenamiento
 *
 * @export
 * @class StorageController
 */
@Controller('storage')
// @UseFilters(MongoServerErrorExceptionFilter)
export class StorageController {
  /**
   * Crea una instancia de StorageController
   *
   * @param {LocationService} locationService Servicio de persistencia de ubicación
   * @param {StockService} stockService Servicio de persistencia de stock
   * @param {InventoryTransferService} inventoryTransferService Servicio de persistencia de transferencia de inventario
   * @param {ProductExistService} productExistService Servicio de validación de existencia de producto
   * @param {RegisteredNewLocationPublisher} registeredNewLocationPublisher Publicador de registro de nueva ubicación
   * @param {UpdatedLocationInfoPublisher} updatedLocationInfoPublisher Publicador de actualización de información de ubicación
   * @param {RegisteredInventoryTransferPublisher} registeredInventoryTransferPublisher Publicador de registro de transferencia de inventario
   * @memberof StorageController
   */
  constructor(
    private readonly locationService: LocationService,
    private readonly stockService: StockService,
    private readonly inventoryTransferService: InventoryTransferService,
    private readonly productExistService: ProductExistService,
    private readonly registeredNewLocationPublisher: RegisteredNewLocationPublisher,
    private readonly updatedLocationInfoPublisher: UpdatedLocationInfoPublisher,
    private readonly registeredInventoryTransferPublisher: RegisteredInventoryTransferPublisher,
  ) {}

  /**
   * Registra una nueva ubicación
   *
   * @param {NewLocationDto} newLocationDto Datos de la nueva ubicación
   * @return {Observable<LocationDomainModel>} Observable con la ubicación
   * @memberof StorageController
   */
  @UseGuards(JwtGuard)
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

  /**
   * Obtiene la información de una ubicación
   *
   * @param {string} locationId Identificador de la ubicación
   * @return {Observable<LocationDomainModel>} Observable con la ubicación
   * @memberof StorageController
   */
  @UseGuards(JwtGuard)
  @Get('location/info/:_id')
  getLocationInfo(
    @Param('_id') locationId: string,
  ): Observable<LocationDomainModel> {
    const getLocationInfoUseCase = new GetLocationInfoUseCase(
      this.locationService,
    );
    return getLocationInfoUseCase.execute(locationId);
  }

  /**
   * Actualiza la información de una ubicación
   *
   * @param {UpdateLocationDto} updateLocationDto Datos de actualización de la ubicación
   * @param {string} locationId Identificador de la ubicación
   * @return {Observable<LocationDomainModel>} Observable con la ubicación
   * @memberof StorageController
   */
  @UseGuards(JwtGuard)
  @Put('location/update/:_id')
  updateLocation(
    @Body() updateLocationDto: UpdateLocationDto,
    @Param('_id') locationId: string,
  ): Observable<LocationDomainModel> {
    const updateLocationInfoUseCase = new UpdateLocationInfoUseCase(
      this.locationService,
      this.updatedLocationInfoPublisher,
    );
    return updateLocationInfoUseCase.execute(locationId, updateLocationDto);
  }

  /**
   * Registra una transferencia de inventario
   *
   * @param {string} authHeader Cabecera de autorización
   * @param {InventoryTransferDto} inventoryTransferDto Datos de la transferencia de inventario
   * @return {Observable<InventoryTransferDomainModel>} Observable con la transferencia de inventario
   * @memberof StorageController
   */
  @UseGuards(JwtGuard)
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
