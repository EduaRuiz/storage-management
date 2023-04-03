import { Injectable } from '@nestjs/common';
import { InventoryTransferMongoService } from '../database/mongo/services';

/**
 * Servicio de transferencia de inventario general
 *
 * @export
 * @class InventoryTransferService
 * @extends {InventoryTransferMongoService}
 */
@Injectable()
export class InventoryTransferService extends InventoryTransferMongoService {}
