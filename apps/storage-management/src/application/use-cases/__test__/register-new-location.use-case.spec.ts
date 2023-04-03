import { RegisteredNewLocationDomainEvent } from 'apps/storage-management/src/domain/events';
import { ILocationDomainService } from 'apps/storage-management/src/domain/services';
import { RegisterNewLocationUseCase } from '..';
import { INewLocationDomainDto } from 'apps/storage-management/src/domain/dtos';
import { LocationDomainModel } from 'apps/storage-management/src/domain/models';
import { of, throwError } from 'rxjs';

describe('RegisterNewLocationUseCase', () => {
  let location$: ILocationDomainService;
  let registeredNewLocationDomainEvent: RegisteredNewLocationDomainEvent;
  let useCase: RegisterNewLocationUseCase;

  beforeEach(() => {
    location$ = {
      createLocation: jest.fn(),
    } as unknown as ILocationDomainService;
    registeredNewLocationDomainEvent = {
      publish: jest.fn(),
    } as unknown as RegisteredNewLocationDomainEvent;
    useCase = new RegisterNewLocationUseCase(
      location$,
      registeredNewLocationDomainEvent,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new location and publish an event', (done) => {
      // Arrange
      const newLocationDto: INewLocationDomainDto = {
        name: 'Test Location',
        description: 'Test Description',
        address: '123 Test St',
      };
      const createdLocation: LocationDomainModel = {
        _id: 'test-location-id',
        description: 'Test Description',
        name: 'Test Location',
        address: '123 Test St',
      };

      jest
        .spyOn(location$, 'createLocation')
        .mockReturnValue(of(createdLocation));

      // Act
      const result$ = useCase.execute(newLocationDto);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(createdLocation);
          expect(location$.createLocation).toHaveBeenCalledWith(newLocationDto);
          expect(registeredNewLocationDomainEvent.publish).toHaveBeenCalledWith(
            createdLocation,
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should return an error if location creation fails', (done) => {
      // Arrange
      const newLocationDto: INewLocationDomainDto = {
        name: 'Test Location',
        address: '123 Test St',
        description: 'Test Description',
      };
      const error = 'Failed to create new location';

      jest
        .spyOn(location$, 'createLocation')
        .mockReturnValue(throwError(error));

      // Act
      const result$ = useCase.execute(newLocationDto);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(location$.createLocation).toHaveBeenCalledWith(newLocationDto);
          expect(
            registeredNewLocationDomainEvent.publish,
          ).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
