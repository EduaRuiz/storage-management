import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

/**
 * Configuración para implementar TypeOrm
 *
 * @export
 * @class TypeOrmPostgresConfigService
 * @implements {TypeOrmOptionsFactory}
 */
@Injectable()
export class TypeOrmPostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  /**
   * Toma la configuración necesaria para la conexión
   *
   * @return {TypeOrmModuleOptions} Opciones de configuración
   * @memberof TypeOrmPostgresConfigService
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_DB_HOST', 'localhost'),
      port: this.configService.get<number>('POSTGRES_DB_PORT'),
      username: this.configService.get<string>('POSTGRES_DB_USER', 'root'),
      password: this.configService.get<string>(
        'POSTGRES_DB_PASSWORD',
        'password',
      ),
      database: this.configService.get<string>('POSTGRES_DB_NAME'),
      entities: [join(__dirname, '..', 'entities', '*.entity.{ts,js}')],
      synchronize: true,
      logging: true,
    };
  }
}
