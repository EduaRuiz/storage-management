import { Observable } from 'rxjs';
import { LocationMongoModel } from '../models';
import { Injectable } from '@nestjs/common';
import { LocationMongoRepository } from '../repositories';
import { ILocationDomainService } from 'apps/storage-management/src/domain/services';

/**
 * Servicio de ubicación en MongoDB
 *
 * @export
 * @class LocationMongoService
 * @implements {ILocationDomainService<LocationMongoModel>}
 */
@Injectable()
export class LocationMongoService
  implements ILocationDomainService<LocationMongoModel>
{
  /**
   * Crea una instancia de LocationMongoService
   *
   * @param {LocationMongoRepository} locationMongoRepository Repositorio de ubicación en MongoDB
   * @memberof LocationMongoService
   */
  constructor(
    private readonly locationMongoRepository: LocationMongoRepository,
  ) {}

  /**
   * Crea una ubicación
   *
   * @param {LocationMongoModel} entity Ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoService
   */
  createLocation(entity: LocationMongoModel): Observable<LocationMongoModel> {
    return this.locationMongoRepository.create(entity);
  }

  /**
   * Actualiza una ubicación
   *
   * @param {string} entityId Id de la ubicación
   * @param {LocationMongoModel} entity Ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoService
   */
  updateLocation(
    entityId: string,
    entity: LocationMongoModel,
  ): Observable<LocationMongoModel> {
    return this.locationMongoRepository.update(entityId, entity);
  }

  /**
   * Obtiene una ubicación por su id
   *
   * @param {string} entityId Id de la ubicación
   * @return {Observable<LocationMongoModel>} Observable de ubicación
   * @memberof LocationMongoService
   */
  getLocationById(entityId: string): Observable<LocationMongoModel> {
    return this.locationMongoRepository.findOneById(entityId);
  }

  /**
   * Obtiene todas las ubicaciones
   *
   * @return {Observable<LocationMongoModel[]>} Observable de ubicaciones
   * @memberof LocationMongoService
   */
  getAll(): Observable<LocationMongoModel[]> {
    return this.locationMongoRepository.findAll();
  }
}
