import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { ILocationExistDomainService } from 'apps/inventory/src/domain/services';
import { ILocationExist } from '@inventory/domain/interfaces/data-out-context';
import { LocationExistService } from '..';

describe('LocationExistService', () => {
  let service: ILocationExistDomainService;
  let httpService: HttpService;
  const locationId = '123';
  const token = 'valid-token';
  const expectedResponse: ILocationExist = {
    _id: locationId,
    name: 'location-name',
    description: 'location-description',
    address: 'location-address',
  };

  beforeEach(() => {
    httpService = {
      get: jest.fn().mockReturnValue(
        of({
          data: expectedResponse,
        } as AxiosResponse<ILocationExist>),
      ),
    } as unknown as HttpService;
    service = new LocationExistService(httpService);
  });

  describe('when exist is called', () => {
    // Arrange
    let result$: Observable<ILocationExist>;

    beforeEach(() => {
      // Act
      result$ = service.exist(locationId, token);
    });

    it('should call httpService.get with the correct parameters', (done) => {
      // Assert
      result$.subscribe(() => {
        expect(httpService.get).toHaveBeenCalledWith(
          `http://localhost:3001/storage/location/info/${locationId}`,
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
