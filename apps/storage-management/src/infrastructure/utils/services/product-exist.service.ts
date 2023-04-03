import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { IProductExistDomainService } from 'apps/storage-management/src/domain/services';
import { Observable } from 'rxjs/internal/Observable';
import { IProductExist } from '../../../domain/interfaces/data-out-context';
import { AxiosResponse } from 'axios';

/**
 * Servicio de existencia de producto
 *
 * @export
 * @class ProductExistService
 * @implements {IProductExistDomainService}
 */
@Injectable()
export class ProductExistService implements IProductExistDomainService {
  /**
   * Crea una instancia de ProductExistService
   *
   * @param {HttpService} httpService Servicio HTTP
   * @memberof ProductExistService
   */
  constructor(private readonly httpService: HttpService) {}

  /**
   * Verifica si un producto existe
   *
   * @param {string} productId Id de producto
   * @param {string} token Token de autenticación
   * @return {Observable<IProductExist>} Observable de producto existente
   * @memberof ProductExistService
   */
  exist(productId: string, token: string): Observable<IProductExist> {
    const headers = {
      Authorization: `Bearer ${token}`, // Agregar token como encabezado
    };
    return this.httpService
      .get<IProductExist>(
        `http://localhost:3000/inventory/product/info/${productId.toString()}`,
        { headers }, // Agregar encabezados a la solicitud
      )
      .pipe(map((response: AxiosResponse<IProductExist>) => response.data));
  }
}
