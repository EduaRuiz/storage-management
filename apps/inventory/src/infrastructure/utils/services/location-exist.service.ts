import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ILocationExist } from '../../../domain/interfaces/data-out-context';
import { ILocationExistDomainService } from 'apps/inventory/src/domain/services';
import { AxiosResponse } from 'axios';

/**
 * Servicio de dominio de existencia de ubicación
 *
 * @export
 * @class LocationExistService
 * @implements {ILocationExistDomainService}
 */
@Injectable()
export class LocationExistService implements ILocationExistDomainService {
  /**
   * Crea una instancia de LocationExistService
   *
   * @param {HttpService} httpService Servicio HTTP
   * @memberof LocationExistService
   */
  constructor(private readonly httpService: HttpService) {}

  /**
   * Verificar si una ubicación existe
   *
   * @param {string} locationId Id de ubicación
   * @param {string} token Token de autenticación de usuario
   * @return {Observable<ILocationExist>} Observable de existencia de ubicación
   * @memberof LocationExistService
   */
  exist(locationId: string, token: string): Observable<ILocationExist> {
    const headers = {
      Authorization: `Bearer ${token}`, // Agregar token como encabezado
    };
    return this.httpService
      .get<ILocationExist>(
        `http://localhost:3001/storage/location/info/${locationId.toString()}`,
        { headers }, // Agregar encabezados a la solicitud
      )
      .pipe(map((response: AxiosResponse<ILocationExist>) => response.data));
  }
}
