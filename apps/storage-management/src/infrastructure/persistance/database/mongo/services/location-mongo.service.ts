import { Observable } from 'rxjs';
import { LocationMongoSchema } from '../schemas';
import { Injectable } from '@nestjs/common';
import { LocationMongoRepository } from '../repositories';
import { ILocationDomainService } from 'apps/storage-management/src/domain/services';

@Injectable()
export class LocationMongoService
  implements ILocationDomainService<LocationMongoSchema>
{
  constructor(
    private readonly locationMongoRepository: LocationMongoRepository,
  ) {}
  createLocation(entity: LocationMongoSchema): Observable<LocationMongoSchema> {
    return this.locationMongoRepository.create(entity);
  }
  updateLocation(
    entityId: string,
    entity: LocationMongoSchema,
  ): Observable<LocationMongoSchema> {
    return this.locationMongoRepository.update(entityId, entity);
  }

  getLocationById(entityId: string): Observable<LocationMongoSchema> {
    return this.locationMongoRepository.findOneById(entityId);
  }

  getAll(): Observable<LocationMongoSchema[]> {
    return this.locationMongoRepository.findAll();
  }
}
