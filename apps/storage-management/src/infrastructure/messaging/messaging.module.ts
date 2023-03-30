import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
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
          urls: ['amqp://root:password@localhost:5672'],
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
  ],
  exports: [
    RegisteredNewLocationPublisher,
    UpdatedLocationInfoPublisher,
    RegisteredInventoryTransferPublisher,
  ],
})
export class MessagingModule {}
