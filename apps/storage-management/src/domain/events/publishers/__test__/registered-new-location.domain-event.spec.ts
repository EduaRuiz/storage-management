import { Observable, of } from 'rxjs';
import { LocationDomainModel } from '../../../models';
import { RegisteredNewLocationDomainEvent } from '..';

class RegisteredNewLocationDomainEventImpl extends RegisteredNewLocationDomainEvent<LocationDomainModel> {
  publish(location: LocationDomainModel): Observable<LocationDomainModel> {
    return of(location);
  }
}

describe('RegisteredNewLocationDomainEvent', () => {
  let event: RegisteredNewLocationDomainEvent<LocationDomainModel>;
  let location: LocationDomainModel;

  beforeEach(() => {
    // Arrange
    location = {} as unknown as LocationDomainModel;
    event = new RegisteredNewLocationDomainEventImpl();
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
