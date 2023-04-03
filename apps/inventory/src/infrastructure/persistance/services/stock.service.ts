import { Injectable } from '@nestjs/common';
import { StockMongoService } from '../database/mongo/services';

/**
 * Servicio de stock general
 *
 * @export
 * @class StockService
 * @extends {StockMongoService}
 */
@Injectable()
export class StockService extends StockMongoService {}
