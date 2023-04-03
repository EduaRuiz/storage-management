import { Injectable } from '@nestjs/common';
import { InventoryMovementMongoService } from '../database/mongo/services';

/**
 * Servicio de movimientos de inventario general
 *
 * @export
 * @class InventoryMovementService
 * @extends {InventoryMovementMongoService}
 */
@Injectable()
export class InventoryMovementService extends InventoryMovementMongoService {}
