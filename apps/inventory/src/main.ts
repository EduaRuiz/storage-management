import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  await app.listen(3000);
  console.log(
    `🚀 Application is running on: ${await app.getUrl()} INVENTORY 🚀`,
  );
}
bootstrap();
