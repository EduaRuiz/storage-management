import { Injectable } from '@nestjs/common';
import { InventoryTransferMongoService } from '../database/mongo/services';

@Injectable()
export class InventoryTransferService extends InventoryTransferMongoService {}
