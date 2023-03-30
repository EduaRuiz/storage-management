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
import { MongoServerErrorExceptionFilter } from './infrastructure/utils/exception-filters';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/utils/strategies';

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
  controllers: [StorageController, StorageEventController],
  providers: [
    ProductExistService,
    MongoServerErrorExceptionFilter,
    JwtStrategy,
    JwtModule,
    JwtService,
  ],
  exports: [PassportModule, JwtStrategy, JwtModule, JwtService],
})
export class AppModule {}
