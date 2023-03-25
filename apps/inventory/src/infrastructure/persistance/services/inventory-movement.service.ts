import { Injectable } from '@nestjs/common';
import { InventoryMovementMongoService } from '../database/mongo/services';

@Injectable()
export class InventoryMovementService extends InventoryMovementMongoService {}
