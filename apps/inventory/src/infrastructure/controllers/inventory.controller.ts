import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  UpdateProductInfoUseCase,
} from '../../application/use-cases';
import {
  InventoryMovementDto,
  NewProductDto,
  UpdateProductDto,
} from '../utils/dtos';
import {
  GotInventoryMovementByProductPublisher,
  GotStocksByProductPublisher,
  RegisteredInventoryMovementPublisher,
  RegisteredNewProductPublisher,
  UpdatedProductInfoPublisher,
} from '../messaging/publishers';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly productService: ProductService,
    private readonly registeredNewProductPublisher: RegisteredNewProductPublisher,
    private readonly updatedProductInfoPublisher: UpdatedProductInfoPublisher,
    private readonly stockService: StockService,
    private readonly gotStocksByProductPublisher: GotStocksByProductPublisher,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly registeredInventoryMovementPublisher: RegisteredInventoryMovementPublisher,
    private readonly gotInventoryMovementByProductPublisher: GotInventoryMovementByProductPublisher,
  ) {}

  @Post('product/create')
  createProduct(@Body() product: NewProductDto) {
    const newProduct = new RegisterNewProductUseCase(
      this.productService,
      this.registeredNewProductPublisher,
    );
    return newProduct.execute(product);
  }

  @Post('product/update/:id')
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

  @Get('product/info/:id')
  getProduct(@Param('id') productId: string) {
    const newProduct = new GetProductInfoUseCase(
      this.productService,
      this.updatedProductInfoPublisher,
    );
    return newProduct.execute(productId);
  }

  @Post('movement/register')
  registerInventoryMovement(@Body() movement: InventoryMovementDto) {
    const registerInventoryMovement = new RegisterInventoryMovementUseCase(
      this.inventoryMovementService,
      this.stockService,
      this.registeredInventoryMovementPublisher,
    );
    return registerInventoryMovement.execute(movement);
  }

  @Get('inventory-movements/product/:id')
  getInventoryMovementsByProduct(@Param('id') productId: string) {
    const inventoryMovements = new GetInventoryMovementsByProductUseCase(
      this.inventoryMovementService,
      this.gotInventoryMovementByProductPublisher,
    );
    return inventoryMovements.execute(productId);
  }

  @Get('stocks/product/:id')
  getStocksByProduct(@Param('id') productId: string) {
    const inventoryMovements = new GetStocksByProductUseCase(
      this.stockService,
      this.gotStocksByProductPublisher,
    );
    return inventoryMovements.execute(productId);
  }

  // @Get()
  // getProducts() {
  // return this.productService.create({
  //   _id: '641df4a57478d16e7cba9b0a',
  //   name: 'test',
  //   description: 'test',
  //   price: 1,
  // });
  // return this.productService.findAll();
  // return this.productService.findOneById('641df4a57478d16e7cba9b0a');
  // return this.stockService.create({
  //   _id: '641df4a57478d16e7cba9b0a',
  //   quantity: 1,
  //   dateTime: new Date(),
  //   locationId: '641df4a57478d16e7cba9b0a',
  //   product: {
  //     _id: '641df4a57478d16e7cba9b0a',
  //     name: 'test',
  //     description: 'test',
  //     price: 1,
  //   },
  // });
  // return this.inventoryMovementService.create(
  //   '',
  //   {} as InventoryMovementEntity,
  // );
}
