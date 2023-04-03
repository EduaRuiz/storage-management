import { ILocationDomainService } from 'apps/storage-management/src/domain/services';
import { of, throwError } from 'rxjs';
import { GetLocationInfoUseCase } from '..';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';

describe('GetLocationInfoUseCase', () => {
  let location$: ILocationDomainService;
  let useCase: GetLocationInfoUseCase;

  beforeEach(() => {
    location$ = {
      getLocationById: jest.fn(),
    } as unknown as ILocationDomainService;
    useCase = new GetLocationInfoUseCase(location$);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return the location information for a given entity ID', (done) => {
      // Arrange
      const entityId = 'test-entity-id';
      const locationInfo: LocationDomainModel = {
        _id: 'test-location-id',
        description: 'Test Description',
        name: 'Test Location',
        address: '123 Test St',
      };

      jest
        .spyOn(location$, 'getLocationById')
        .mockReturnValue(of(locationInfo));

      // Act
      const result$ = useCase.execute(entityId);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(locationInfo);
          expect(location$.getLocationById).toHaveBeenCalledWith(entityId);
          done();
        },
        error: done.fail,
      });
    });

    it('should return an error if location retrieval fails', (done) => {
      // Arrange
      const entityId = 'test-entity-id';
      const error = 'Failed to retrieve location information';

      jest
        .spyOn(location$, 'getLocationById')
        .mockReturnValue(throwError(error));

      // Act
      const result$ = useCase.execute(entityId);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(location$.getLocationById).toHaveBeenCalledWith(entityId);
          done();
        },
      });
    });
  });
});
