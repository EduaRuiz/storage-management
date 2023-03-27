import { Injectable } from '@nestjs/common';
import { StockMongoService } from '../database/mongo/services';

@Injectable()
export class StockService extends StockMongoService {}
