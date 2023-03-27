import { Injectable } from '@nestjs/common';
import { LocationMongoService } from '../database/mongo/services';

@Injectable()
export class LocationService extends LocationMongoService {}
