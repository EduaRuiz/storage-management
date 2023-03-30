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
  GotInventoryMovementByProductPublisher,
  GotProductInfoPublisher,
  GotStocksByProductPublisher,
  RegisteredInventoryMovementPublisher,
  RegisteredNewProductPublisher,
  RemovedProductPublisher,
  UpdatedProductInfoPublisher,
} from '../messaging/publishers';
import { LocationExistService } from '../utils/services';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly locationExistService: LocationExistService,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly registeredNewProductPublisher: RegisteredNewProductPublisher,
    private readonly updatedProductInfoPublisher: UpdatedProductInfoPublisher,
    private readonly gotProductInfoPublisher: GotProductInfoPublisher,
    private readonly gotStocksByProductPublisher: GotStocksByProductPublisher,
    private readonly registeredInventoryMovementPublisher: RegisteredInventoryMovementPublisher,
    private readonly gotInventoryMovementByProductPublisher: GotInventoryMovementByProductPublisher,
    private readonly removedProductPublisher: RemovedProductPublisher,
  ) {}

  @UseGuards(AuthGuard())
  @Post('product/create')
  createProduct(@Body() product: NewProductDto) {
    const newProduct = new RegisterNewProductUseCase(
      this.productService,
      this.registeredNewProductPublisher,
    );
    return newProduct.execute(product);
  }

  @UseGuards(AuthGuard())
  @Put('product/update/:id')
  updateProduct(
    @Param('id') productId: string,
    @Body() product: UpdateProductDto,
  ) {
    const newProduct = new UpdateProductInfoUseCase(
      this.productService,
      this.updatedProductInfoPublisher,
    );
    return newProduct.execute(productId, product);
  }

  @UseGuards(AuthGuard())
  @Get('product/info/:id')
  getProductInfo(@Param('id') productId: string) {
    const newProduct = new GetProductInfoUseCase(
      this.productService,
      this.gotProductInfoPublisher,
    );
    return newProduct.execute(productId);
  }

  @UseGuards(AuthGuard())
  @Post('movement/register')
  registerInventoryMovement(
    @Headers('authorization') authHeader: string,
    @Body() movement: InventoryMovementDto,
  ) {
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

  @UseGuards(AuthGuard())
  @Get('inventory-movements/product/:id')
  getInventoryMovementsByProduct(@Param('id') productId: string) {
    const inventoryMovements = new GetInventoryMovementsByProductUseCase(
      this.inventoryMovementService,
      this.gotInventoryMovementByProductPublisher,
    );
    return inventoryMovements.execute(productId);
  }

  @UseGuards(AuthGuard())
  @Get('stocks/product/:id')
  getStocksByProduct(@Param('id') productId: string) {
    const inventoryMovements = new GetStocksByProductUseCase(
      this.stockService,
      this.gotStocksByProductPublisher,
    );
    return inventoryMovements.execute(productId);
  }

  @UseGuards(AuthGuard())
  @Delete('product/:id')
  deleteProduct(@Param('id') productId: string) {
    const removeProductUseCase = new RemoveProductUseCase(
      this.productService,
      this.stockService,
      this.removedProductPublisher,
    );
    return removeProductUseCase.execute(productId);
  }
}
