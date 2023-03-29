import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, from } from 'rxjs';
import { IProductExistDomainService } from 'apps/storage-management/src/domain/services';
import { Observable } from 'rxjs/internal/Observable';
import { IProductExist } from '../../../domain/interfaces/data-out-context';

@Injectable()
export class ProductExistService implements IProductExistDomainService {
  constructor(private readonly httpService: HttpService) {}
  exist(subjectId: string): Observable<IProductExist> {
    const data = firstValueFrom(
      this.httpService.get<IProductExist>(
        `http://localhost:3000/inventory/product/info/${subjectId.toString()}`,
      ),
    );
    return from(data.then((response) => response.data));
  }
}
