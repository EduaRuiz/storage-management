import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { StockStorageEventManagerUseCase } from '../../application/use-cases';
import { Controller } from '@nestjs/common';
import { ProductService, StockService } from '../persistance/services';

@Controller()
export class InventoryEventController {
  constructor(
    private readonly productService: ProductService,
    private readonly stockService: StockService,
  ) {}
  @MessagePattern('registered-inventory-transfer')
  registeredInventoryTransfer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log(JSON.parse(data));
    const stockStorageEventManagerUseCase = new StockStorageEventManagerUseCase(
      this.stockService,
      this.productService,
    );
    stockStorageEventManagerUseCase
      .execute(JSON.parse(data).stockIn)
      .subscribe();
    stockStorageEventManagerUseCase
      .execute(JSON.parse(data).stockOut)
      .subscribe();
  }
}
