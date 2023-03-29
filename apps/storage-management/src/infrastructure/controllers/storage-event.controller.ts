import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { LocationService, StockService } from '../persistance/services';
import { Controller } from '@nestjs/common';
import { StockInventoryEventManagerUseCase } from '../../application/use-cases';

@Controller()
export class StorageEventController {
  constructor(
    private readonly stock$: StockService,
    private readonly location$: LocationService,
  ) {}

  @MessagePattern('registered-inventory-movement')
  inscriptionCommitted(@Payload() data: any, @Ctx() context: RmqContext): void {
    const stockInventoryEventManagerUseCase =
      new StockInventoryEventManagerUseCase(this.stock$, this.location$);
    stockInventoryEventManagerUseCase
      .execute(JSON.parse(data).stock)
      .subscribe();
  }
}
