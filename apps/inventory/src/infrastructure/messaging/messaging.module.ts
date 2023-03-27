import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RegisteredNewProductPublisher } from './publishers';

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
  providers: [RegisteredNewProductPublisher],
  exports: [RegisteredNewProductPublisher],
})
export class MessagingModule {}
