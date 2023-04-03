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

/**
 * Controlador de inventario
 *
 * @export
 * @class InventoryController
 */
@Controller('inventory')
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
