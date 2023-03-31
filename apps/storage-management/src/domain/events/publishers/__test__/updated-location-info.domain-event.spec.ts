import { Observable, of } from 'rxjs';
import { UpdatedLocationInfoDomainEvent } from '..';
import { LocationDomainModel } from '../../../models';

class UpdatedLocationInfoDomainEventImpl extends UpdatedLocationInfoDomainEvent<LocationDomainModel> {
  publish(location: LocationDomainModel): Observable<LocationDomainModel> {
    return of(location);
  }
}

describe('UpdatedLocationInfoDomainEvent', () => {
  let event: UpdatedLocationInfoDomainEvent<LocationDomainModel>;
  let location: LocationDomainModel;

  beforeEach(() => {
    // Arrange
    location = {} as unknown as LocationDomainModel;
    event = new UpdatedLocationInfoDomainEventImpl();
  });

  it('should publish new location', (done) => {
    // Act
    const response$ = event.publish(location);

    // Assert
    response$.subscribe((response) => {
      expect(response).toBe(location);
      done();
    });
  });
});
