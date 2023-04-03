import { Injectable } from '@nestjs/common';
import { ProductMongoService } from '../database/mongo/services';

/**
 * Servicio de productos general
 *
 * @export
 * @class ProductService
 * @extends {ProductMongoService}
 */
@Injectable()
export class ProductService extends ProductMongoService {}
