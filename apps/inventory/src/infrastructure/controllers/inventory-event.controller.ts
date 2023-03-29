import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

export class InventoryEventController {
  @MessagePattern('registered-inventory-transfer')
  registeredInventoryTransfer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('registered-inventory-transfer', JSON.parse(data));
  }
}
