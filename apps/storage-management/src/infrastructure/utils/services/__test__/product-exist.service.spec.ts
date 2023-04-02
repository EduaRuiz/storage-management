import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { ProductExistService } from '..';
import { IProductExistDomainService } from '@storage/domain/services';
import { IProductExist } from '@storage/domain/interfaces/data-out-context';

describe('ProductExistService', () => {
  let service: IProductExistDomainService;
  let httpService: HttpService;
  const productId = '123';
  const token = 'valid-token';
  const expectedResponse: IProductExist = {
    _id: productId,
    name: 'product-name',
    description: 'product-description',
    price: 100,
  };

  beforeEach(() => {
    httpService = {
      get: jest.fn().mockReturnValue(
        of({
          data: expectedResponse,
        } as AxiosResponse<IProductExist>),
      ),
    } as unknown as HttpService;
    service = new ProductExistService(httpService);
  });

  describe('when exist is called', () => {
    // Arrange
    let result$: Observable<IProductExist>;

    beforeEach(() => {
      // Act
      result$ = service.exist(productId, token);
    });

    it('should call httpService.get with the correct parameters', (done) => {
      // Assert
      result$.subscribe(() => {
        expect(httpService.get).toHaveBeenCalledWith(
          `http://localhost:3000/inventory/product/info/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        done();
      });
    });

    it('should return the expected response', (done) => {
      // Assert
      result$.subscribe((result) => {
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });
});
