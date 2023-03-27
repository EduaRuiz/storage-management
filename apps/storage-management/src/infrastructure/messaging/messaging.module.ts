import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  GotInventoryTransferByLocationPublisher,
  GotInventoryTransferByProductPublisher,
  GotLocationInfoPublisher,
  RegisteredInventoryTransferPublisher,
  RegisteredNewLocationPublisher,
  UpdatedLocationInfoPublisher,
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
        name: 'STORAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'storage_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    RegisteredNewLocationPublisher,
    UpdatedLocationInfoPublisher,
    RegisteredInventoryTransferPublisher,
    GotLocationInfoPublisher,
    GotInventoryTransferByProductPublisher,
    GotInventoryTransferByLocationPublisher,
  ],
  exports: [
    RegisteredNewLocationPublisher,
    UpdatedLocationInfoPublisher,
    RegisteredInventoryTransferPublisher,
    GotLocationInfoPublisher,
    GotInventoryTransferByProductPublisher,
    GotInventoryTransferByLocationPublisher,
  ],
})
export class MessagingModule {}
