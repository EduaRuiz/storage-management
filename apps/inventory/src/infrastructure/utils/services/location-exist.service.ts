import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ILocationExist } from '../../../domain/interfaces/data-out-context';
import { ILocationExistDomainService } from 'apps/inventory/src/domain/services';
import { AxiosResponse } from 'axios';

@Injectable()
export class LocationExistService implements ILocationExistDomainService {
  constructor(private readonly httpService: HttpService) {}

  exist(locationId: string): Observable<ILocationExist> {
    return this.httpService
      .get<ILocationExist>(
        `http://localhost:3001/storage/location/info/${locationId.toString()}`,
      )
      .pipe(map((response: AxiosResponse<ILocationExist>) => response.data));
  }
}