import { Module } from '@nestjs/common';
import { InventoryController } from './infrastructure/controllers';
import { PersistenceModule } from './infrastructure/persistance';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';

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
  ],
  controllers: [InventoryController],
  providers: [],
})
export class InventoryModule {}
