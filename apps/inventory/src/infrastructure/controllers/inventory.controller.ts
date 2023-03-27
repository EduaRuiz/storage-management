import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  InventoryMovementService,
  ProductService,
  StockService,
} from '../persistance/services/';
import { ConfigService } from '@nestjs/config';
import { StockEntity } from '../persistance/entities/stock.entity';
import { InventoryMovementEntity } from '../persistance/entities/inventory-movement.entity';
import {
  RegisterInventoryMovementUseCase,
  RegisterNewProductUseCase,
} from '../../application/use-cases';
import { InventoryMovementDto, NewProductDto } from '../utils/dtos';
import { RegisteredNewProductPublisher } from '../messaging/publishers';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly productService: ProductService,
    private readonly registeredNewProductPublisher: RegisteredNewProductPublisher,
    private readonly stockService: StockService,
    private readonly inventoryMovementService: InventoryMovementService,
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

  @Post('movement')
  registerInventoryMovement(@Body() movement: InventoryMovementDto) {
    const registerInventoryMovement = new RegisterInventoryMovementUseCase(
      this.inventoryMovementService,
      this.stockService,
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
