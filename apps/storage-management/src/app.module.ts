import { Module } from '@nestjs/common';
import {
  StorageController,
  StorageEventController,
} from './infrastructure/controllers';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './infrastructure/persistance';
import { MessagingModule } from './infrastructure/messaging';
import { join } from 'path';
import { ProductExistService } from './infrastructure/utils/services';
import { HttpModule } from '@nestjs/axios';

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
  controllers: [StorageController, StorageEventController],
  providers: [ProductExistService],
})
export class AppModule {}
