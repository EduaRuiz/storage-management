import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  InventoryMovementService,
  ProductService,
  StockService,
} from '../persistance/services/';
import { ConfigService } from '@nestjs/config';
import { StockEntity } from '../persistance/entities/stock.entity';
import { InventoryMovementEntity } from '../persistance/entities/inventory-movement.entity';
import {
  GetProductInfoUseCase,
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
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly registeredInventoryMovementPublisher: RegisteredInventoryMovementPublisher,
    private readonly configService: ConfigService,
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

  @Post('movement')
  registerInventoryMovement(@Body() movement: InventoryMovementDto) {
    const registerInventoryMovement = new RegisterInventoryMovementUseCase(
      this.inventoryMovementService,
      this.stockService,
      this.registeredInventoryMovementPublisher,
    );
    return registerInventoryMovement.execute(movement);
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
