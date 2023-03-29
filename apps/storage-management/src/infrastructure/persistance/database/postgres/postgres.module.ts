import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPostgresConfigService } from './configs';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmPostgresConfigService,
    // }),
    // TypeOrmModule.forFeature([]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class PostgresModule {}
