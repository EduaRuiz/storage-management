import { LocationService } from '..';
import { LocationMongoService } from '../../database/mongo/services';

describe('LocationService', () => {
  let locationService: LocationService;

  describe('when instantiated', () => {
    it('should extend LocationMongoService class', () => {
      locationService = new LocationService({} as any);
      expect(locationService).toBeInstanceOf(LocationMongoService);
    });
  });
});
