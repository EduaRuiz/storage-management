import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
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
          urls: ['amqp://root:password@localhost:5672'],
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
    RemovedProductPublisher,
  ],
  exports: [
    RegisteredNewProductPublisher,
    UpdatedProductInfoPublisher,
    RegisteredInventoryMovementPublisher,
    RemovedProductPublisher,
  ],
})
export class MessagingModule {}
