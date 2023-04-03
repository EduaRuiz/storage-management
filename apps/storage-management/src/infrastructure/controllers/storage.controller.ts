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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestSwagger,
  InventoryTransferSwaggerEntity,
  LocationSwaggerEntity,
} from '../utils/swagger-types';
import {
  ConflictSwagger,
  NotFoundSwagger,
  UnauthorizedSwagger,
} from '@inventory/infrastructure/utils/swagger-types/errors';

/**
 * Controlador de almacenamiento
 *
 * @export
 * @class StorageController
 */
@Controller('storage')
// @UseFilters(MongoServerErrorExceptionFilter)
@ApiTags('Storage Management API')
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
  @ApiOperation({
    summary:
      'Registra una nueva ubicación en el sistema de almacenamiento y devuelve la ubicación creada',
  })
  @ApiResponse({
    status: 200,
    description: 'La ubicación creada se devuelve en el cuerpo de la respuesta',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la ubicación',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Errores en la petición',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto',
    type: ConflictSwagger,
  })
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
  @ApiOperation({
    summary:
      'Obtiene la información de una ubicación en el sistema de almacenamiento y devuelve la ubicación',
  })
  @ApiResponse({
    status: 200,
    description:
      'La ubicación buscada se devuelve en el cuerpo de la respuesta',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la ubicación',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Errores en la petición',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto',
    type: ConflictSwagger,
  })
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
  @ApiOperation({
    summary:
      'Actualiza la información de una ubicación en el sistema de almacenamiento y devuelve la ubicación actualizada',
  })
  @ApiResponse({
    status: 200,
    description:
      'La ubicación actualizada se devuelve en el cuerpo de la respuesta',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la ubicación',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Errores en la petición',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto',
    type: ConflictSwagger,
  })
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
  @ApiOperation({
    summary:
      'Registra una transferencia de inventario en el sistema de almacenamiento y devuelve la transferencia de inventario registrada',
  })
  @ApiResponse({
    status: 200,
    description:
      'La transferencia de inventario registrada se devuelve en el cuerpo de la respuesta',
    type: InventoryTransferSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description:
      'No se encontró el producto, el stock y/o la ubicación para la transferencia de inventario',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Errores en la petición',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto',
    type: ConflictSwagger,
  })
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
