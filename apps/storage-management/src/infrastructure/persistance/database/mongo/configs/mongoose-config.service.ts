import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

/**
 * Configuración de conexión a base de datos de MongoDB
 *
 * @export
 * @class MongooseConfigService
 * @implements {MongooseOptionsFactory}
 */
@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  /**
   * Crea una instancia de MongooseConfigService
   *
   * @param {ConfigService} configService Servicio de configuración
   * @memberof MongooseConfigService
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Crea las opciones de conexión a base de datos de MongoDB
   *
   * @return  {MongooseModuleOptions} Opciones de conexión
   * @memberof MongooseConfigService
   */
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('MONGO_DB_URI_STORAGE'),
      dbName: this.configService.get<string>('MONGO_DB_NAME_STORAGE'),
    };
  }
}
