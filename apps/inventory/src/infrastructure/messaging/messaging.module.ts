import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  GotInventoryMovementByProductPublisher,
  GotProductInfoPublisher,
  GotStocksByProductPublisher,
  RegisteredInventoryMovementPublisher,
  RegisteredNewProductPublisher,
  RemovedProductPublisher,
  UpdatedProductInfoPublisher,
} from './publishers';

/**
 * Modulo de mensajería
 *
 * @export
 * @class MessagingModule
 */
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'inventory_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    RegisteredNewProductPublisher,
    UpdatedProductInfoPublisher,
    RegisteredInventoryMovementPublisher,
    GotProductInfoPublisher,
    GotInventoryMovementByProductPublisher,
    GotStocksByProductPublisher,
    RemovedProductPublisher,
  ],
  exports: [
    RegisteredNewProductPublisher,
    UpdatedProductInfoPublisher,
    RegisteredInventoryMovementPublisher,
    GotProductInfoPublisher,
    GotInventoryMovementByProductPublisher,
    GotStocksByProductPublisher,
    RemovedProductPublisher,
  ],
})
export class MessagingModule {}
