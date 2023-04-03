import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  InventoryMovementService,
  ProductService,
  StockService,
} from '../persistance/services/';
import {
  GetInventoryMovementsByProductUseCase,
  GetProductInfoUseCase,
  GetStocksByProductUseCase,
  RegisterInventoryMovementUseCase,
  RegisterNewProductUseCase,
  RemoveProductUseCase,
  UpdateProductInfoUseCase,
} from '../../application/use-cases';
import {
  InventoryMovementDto,
  NewProductDto,
  UpdateProductDto,
} from '../utils/dtos';
import {
  RegisteredInventoryMovementPublisher,
  RegisteredNewProductPublisher,
  RemovedProductPublisher,
  UpdatedProductInfoPublisher,
} from '../messaging/publishers';
import { LocationExistService } from '../utils/services';
import { JwtGuard } from '../utils/guards';
import { Observable } from 'rxjs';
import {
  InventoryMovementDomainModel,
  ProductDomainModel,
  StockDomainModel,
} from '@inventory/domain/models';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationSwaggerEntity } from '@storage/infrastructure/utils/swagger-types';
import {
  BadRequestSwagger,
  ConflictSwagger,
  NotFoundSwagger,
  UnauthorizedSwagger,
} from '../utils/swagger-types/errors';

/**
 * Controlador de inventario
 *
 * @export
 * @class InventoryController
 */
@Controller('inventory')
@ApiTags('Inventory Management API')
export class InventoryController {
  /**
   * Crea una instancia de InventoryController
   *
   * @param {ProductService} productService Servicio de productos
   * @param {StockService} stockService Servicio de stock
   * @param {LocationExistService} locationExistService Servicio de existencia de ubicación
   * @param {InventoryMovementService} inventoryMovementService Servicio de movimientos de inventario
   * @param {RegisteredNewProductPublisher} registeredNewProductPublisher Publicador de productos nuevos
   * @param {UpdatedProductInfoPublisher} updatedProductInfoPublisher Publicador de actualización de información de producto
   * @param {RegisteredInventoryMovementPublisher} registeredInventoryMovementPublisher Publicador de movimientos de inventario
   * @param {RemovedProductPublisher} removedProductPublisher Publicador de productos eliminados
   * @memberof InventoryController
   */
  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly locationExistService: LocationExistService,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly registeredNewProductPublisher: RegisteredNewProductPublisher,
    private readonly updatedProductInfoPublisher: UpdatedProductInfoPublisher,
    private readonly registeredInventoryMovementPublisher: RegisteredInventoryMovementPublisher,
    private readonly removedProductPublisher: RemovedProductPublisher,
  ) {}

  /**
   * Crea un nuevo producto
   *
   * @param {NewProductDto} product Datos del producto
   * @return {Observable<ProductDomainModel>} Observable con el producto
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Post('product/create')
  @ApiOperation({
    summary:
      'Crea un nuevo producto en el inventario del sistema y lo publica en el bus de eventos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Producto creado exitosamente en el inventario del sistema y publicado en el bus de eventos',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description:
      'No se encontró el producto solicitado en el inventario del sistema',
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
  createProduct(
    @Body() product: NewProductDto,
  ): Observable<ProductDomainModel> {
    const newProduct = new RegisterNewProductUseCase(
      this.productService,
      this.registeredNewProductPublisher,
    );
    return newProduct.execute(product);
  }

  /**
   * Actualiza la información de un producto
   *
   * @param {string} productId Identificador del producto
   * @param {UpdateProductDto} product Datos del producto
   * @return {Observable<ProductDomainModel>} Observable con el producto actualizado
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Put('product/update/:id')
  @ApiOperation({
    summary:
      'Actualiza la información de un producto en el inventario del sistema y lo publica en el bus de eventos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Producto actualizado exitosamente en el inventario del sistema y publicado en el bus de eventos',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto solicitado',
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
  updateProduct(
    @Param('id') productId: string,
    @Body() product: UpdateProductDto,
  ): Observable<ProductDomainModel> {
    const newProduct = new UpdateProductInfoUseCase(
      this.productService,
      this.updatedProductInfoPublisher,
    );
    return newProduct.execute(productId, product);
  }

  /**
   * Obtiene la información de un producto
   *
   * @param {string} productId Identificador del producto
   * @return  {Observable<ProductDomainModel>} Observable con el producto
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Get('product/info/:id')
  @ApiOperation({
    summary:
      'Obtiene la información de un producto en el inventario del sistema',
  })
  @ApiResponse({
    status: 200,
    description:
      'Producto encontrado exitosamente en el inventario del sistema',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto solicitado',
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
  getProductInfo(
    @Param('id') productId: string,
  ): Observable<ProductDomainModel> {
    const newProduct = new GetProductInfoUseCase(this.productService);
    return newProduct.execute(productId);
  }

  /**
   * Registra un movimiento de inventario
   *
   * @param {string} authHeader Cabecera de autorización
   * @param {InventoryMovementDto} movement Datos del movimiento
   * @return {Observable<InventoryMovementDomainModel>} Observable con el movimiento de inventario
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Post('movement/register')
  @ApiOperation({
    summary:
      'Registra un movimiento de inventario en el inventario del sistema y lo publica en el bus de eventos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Movimiento de inventario registrado exitosamente en el sistema y publicado en el bus de eventos',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto solicitado, la ubicación o stock',
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
  registerInventoryMovement(
    @Headers('authorization') authHeader: string,
    @Body() movement: InventoryMovementDto,
  ): Observable<InventoryMovementDomainModel> {
    const token = authHeader?.split(' ')[1];
    const registerInventoryMovement = new RegisterInventoryMovementUseCase(
      this.inventoryMovementService,
      this.stockService,
      this.productService,
      this.locationExistService,
      this.registeredInventoryMovementPublisher,
    );
    return registerInventoryMovement.execute(movement, token);
  }

  /**
   * Obtiene los movimientos de inventario de un producto
   *
   * @param {string} productId Identificador del producto
   * @return {Observable<InventoryMovementDomainModel[]>} Observable con los movimientos de inventario
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Get('inventory-movements/product/:id')
  @ApiOperation({
    summary:
      'Obtiene los movimientos de inventario de un producto en el inventario del sistema',
  })
  @ApiResponse({
    status: 200,
    description:
      'Movimientos de inventario encontrados exitosamente en el sistema',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto solicitado',
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
  getInventoryMovementsByProduct(
    @Param('id') productId: string,
  ): Observable<InventoryMovementDomainModel[]> {
    const inventoryMovements = new GetInventoryMovementsByProductUseCase(
      this.inventoryMovementService,
    );
    return inventoryMovements.execute(productId);
  }

  /**
   * Obtiene los stocks de un producto
   *
   * @param {string} productId Identificador del producto
   * @return {Observable<StockDomainModel[]>} Observable con los stocks
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Get('stocks/product/:id')
  @ApiOperation({
    summary: 'Obtiene los stocks de un producto en el inventario del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Stocks encontrados exitosamente en el sistema',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto solicitado',
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
  getStocksByProduct(
    @Param('id') productId: string,
  ): Observable<StockDomainModel[]> {
    const inventoryMovements = new GetStocksByProductUseCase(this.stockService);
    return inventoryMovements.execute(productId);
  }

  /**
   * Elimina un producto
   *
   * @param {string} productId Identificador del producto
   * @return {Observable<ProductDomainModel>} Observable con el producto eliminado
   * @memberof InventoryController
   */
  @UseGuards(JwtGuard)
  @Delete('product/:id')
  @ApiOperation({
    summary:
      'Elimina un producto en el inventario del sistema y lo publica en el bus de eventos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Producto eliminado exitosamente en el sistema y publicado en el bus de eventos',
    type: LocationSwaggerEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto solicitado',
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
  deleteProduct(
    @Param('id') productId: string,
  ): Observable<ProductDomainModel> {
    const removeProductUseCase = new RemoveProductUseCase(
      this.productService,
      this.stockService,
      this.removedProductPublisher,
    );
    return removeProductUseCase.execute(productId);
  }
}
