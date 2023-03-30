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
import { JwtStrategy } from './infrastructure/utils/strategies';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'll4v3',
      signOptions: { expiresIn: '2h' },
    }),
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
  providers: [LocationExistService, JwtStrategy, JwtModule, JwtService],
  exports: [PassportModule, JwtStrategy, JwtModule, JwtService],
})
export class InventoryModule {}
