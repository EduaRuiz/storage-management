import { Module } from '@nestjs/common';
import {
  InventoryController,
  InventoryEventController,
} from './infrastructure/controllers';
import { PersistenceModule } from './infrastructure/persistance';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { MessagingModule } from './infrastructure/messaging';
import { HttpModule } from '@nestjs/axios';
import { LocationExistService } from './infrastructure/utils/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        'environments',
        `.env.${process.env.SCOPE?.trimEnd()}`,
      ),
    }),
    PersistenceModule,
    MessagingModule,
    HttpModule,
  ],
  controllers: [InventoryController, InventoryEventController],
  providers: [LocationExistService],
})
export class InventoryModule {}
