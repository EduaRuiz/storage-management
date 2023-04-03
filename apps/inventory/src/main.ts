import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  const config = new DocumentBuilder()
    .setTitle('Inventory Service')
    .setDescription('Api Inventory Service')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://root:password@localhost:5672'],
      queue: 'storage_queue',
      queueOptions: { durable: false },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(
    `🚀 Application is running on: ${await app.getUrl()} INVENTORY 🚀`,
  );
}
bootstrap();
