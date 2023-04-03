import { Injectable } from '@nestjs/common';
import { LocationMongoService } from '../database/mongo/services';

/**
 * Servicio de ubicación general
 *
 * @export
 * @class LocationService
 * @extends {LocationMongoService}
 */
@Injectable()
export class LocationService extends LocationMongoService {}
