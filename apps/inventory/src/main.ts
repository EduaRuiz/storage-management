import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(
    `🚀 Application is running on: ${await app.getUrl()} INVENTORY 🚀`,
  );
}
bootstrap();
