import { Injectable } from '@nestjs/common';
import { ProductMongoService } from '../database/mongo/services';

@Injectable()
export class ProductService extends ProductMongoService {}
