import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  GotProductInfoPublisher,
  RegisteredInventoryMovementPublisher,
  RegisteredNewProductPublisher,
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
  ],
  exports: [
    RegisteredNewProductPublisher,
    UpdatedProductInfoPublisher,
    RegisteredInventoryMovementPublisher,
    GotProductInfoPublisher,
  ],
})
export class MessagingModule {}
