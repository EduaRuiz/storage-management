import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { IProductExistDomainService } from 'apps/storage-management/src/domain/services';
import { Observable } from 'rxjs/internal/Observable';
import { IProductExist } from '../../../domain/interfaces/data-out-context';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProductExistService implements IProductExistDomainService {
  constructor(private readonly httpService: HttpService) {}

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
