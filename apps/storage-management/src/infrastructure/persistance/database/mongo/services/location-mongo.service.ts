import { Observable } from 'rxjs';
import { LocationMongoModel } from '../models';
import { Injectable } from '@nestjs/common';
import { LocationMongoRepository } from '../repositories';
import { ILocationDomainService } from 'apps/storage-management/src/domain/services';

@Injectable()
export class LocationMongoService
  implements ILocationDomainService<LocationMongoModel>
{
  constructor(
    private readonly locationMongoRepository: LocationMongoRepository,
  ) {}
  createLocation(entity: LocationMongoModel): Observable<LocationMongoModel> {
    return this.locationMongoRepository.create(entity);
  }
  updateLocation(
    entityId: string,
    entity: LocationMongoModel,
  ): Observable<LocationMongoModel> {
    return this.locationMongoRepository.update(entityId, entity);
  }

  getLocationById(entityId: string): Observable<LocationMongoModel> {
    return this.locationMongoRepository.findOneById(entityId);
  }

  getAll(): Observable<LocationMongoModel[]> {
    return this.locationMongoRepository.findAll();
  }
}
