import { UpdatedLocationInfoDomainEvent } from 'apps/storage-management/src/domain/events';
import { ILocationDomainService } from 'apps/storage-management/src/domain/services';
import { UpdateLocationInfoUseCase } from '..';
import { IUpdateLocationDomainDto } from 'apps/storage-management/src/domain/dtos';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';
import { of, throwError } from 'rxjs';

describe('UpdateLocationInfoUseCase', () => {
  let location$: ILocationDomainService;
  let updatedLocationInfoDomainEvent: UpdatedLocationInfoDomainEvent;
  let useCase: UpdateLocationInfoUseCase;

  beforeEach(() => {
    location$ = {
      getLocationById: jest.fn(),
      updateLocation: jest.fn(),
    } as unknown as ILocationDomainService;
    updatedLocationInfoDomainEvent = {
      publish: jest.fn(),
    } as unknown as UpdatedLocationInfoDomainEvent;
    useCase = new UpdateLocationInfoUseCase(
      location$,
      updatedLocationInfoDomainEvent,
    );
  });

  describe('execute', () => {
    it('should update the location information and publish an event', (done) => {
      // Arrange
      const entityId = 'test-entity-id';
      const updateDto: IUpdateLocationDomainDto = {
        name: 'New Name',
        address: 'New Address',
      };
      const originalLocation: LocationDomainModel = {
        _id: entityId,
        name: 'Original Name',
        address: 'Original Address',
        description: 'Original Description',
      };
      const updatedLocation: LocationDomainModel = {
        _id: entityId,
        name: 'New Name',
        address: 'New Address',
        description: 'Original Description',
      };

      jest
        .spyOn(location$, 'getLocationById')
        .mockReturnValue(of(originalLocation));
      jest
        .spyOn(location$, 'updateLocation')
        .mockReturnValue(of(updatedLocation));

      // Act
      const result$ = useCase.execute(entityId, updateDto);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(updatedLocation);
          expect(location$.getLocationById).toHaveBeenCalledWith(entityId);
          expect(location$.updateLocation).toHaveBeenCalledWith(
            entityId,
            updatedLocation,
          );
          expect(updatedLocationInfoDomainEvent.publish).toHaveBeenCalledWith(
            updatedLocation,
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should return an error if location retrieval fails', (done) => {
      // Arrange
      const entityId = 'test-entity-id';
      const updateDto: IUpdateLocationDomainDto = {
        name: 'New Name',
        address: 'New Address',
      };
      const error = 'Failed to retrieve location information';

      jest
        .spyOn(location$, 'getLocationById')
        .mockReturnValue(throwError(error));

      // Act
      const result$ = useCase.execute(entityId, updateDto);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(location$.getLocationById).toHaveBeenCalledWith(entityId);
          expect(location$.updateLocation).not.toHaveBeenCalled();
          expect(updatedLocationInfoDomainEvent.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should return an error if [location update](poe://www.poe.com/_api/key_phrase?phrase=location%20update&prompt=Tell%20me%20more%20about%20location%20update.) fails', (done) => {
      // Arrange
      const entityId = 'test-entity-id';
      const updateDto: IUpdateLocationDomainDto = {
        name: 'New Name',
        address: 'New Address',
      };
      const originalLocation: LocationDomainModel = {
        _id: entityId,
        name: 'Original Name',
        address: 'Original Address',
        description: 'Original Description',
      };
      const error = new Error('Failed to update location information');

      jest
        .spyOn(location$, 'getLocationById')
        .mockReturnValue(of(originalLocation));
      jest
        .spyOn(location$, 'updateLocation')
        .mockReturnValue(throwError(error));

      // Act
      const result$ = useCase.execute(entityId, updateDto);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(location$.getLocationById).toHaveBeenCalledWith(entityId);
          expect(location$.updateLocation).toHaveBeenCalledWith(entityId, {
            ...originalLocation,
            ...updateDto,
            _id: entityId,
          });
          expect(updatedLocationInfoDomainEvent.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
