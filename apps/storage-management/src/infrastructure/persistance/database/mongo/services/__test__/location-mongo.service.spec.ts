import { Test, TestingModule } from '@nestjs/testing';
import { LocationMongoService } from '..';
import { LocationMongoModel, LocationMongoRepository } from '../..';
import { of } from 'rxjs';

describe('LocationMongoService', () => {
  let locationMongoService: LocationMongoService;
  let locationMongoRepository: LocationMongoRepository;

  const location: LocationMongoModel = {
    _id: '1',
    name: 'Location 1',
    description: 'Description 1',
    address: '123 Main St',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationMongoService,
        {
          provide: LocationMongoRepository,
          useValue: {
            create: jest.fn().mockReturnValue(of(location)),
            update: jest.fn().mockReturnValue(of(location)),
            findOneById: jest.fn().mockReturnValue(of(location)),
            findAll: jest.fn().mockReturnValue(of([location])),
          },
        },
      ],
    }).compile();

    locationMongoService =
      module.get<LocationMongoService>(LocationMongoService);
    locationMongoRepository = module.get<LocationMongoRepository>(
      LocationMongoRepository,
    );
  });

  describe('createLocation', () => {
    it('should create a location', (done) => {
      // Act
      const result$ = locationMongoService.createLocation(location);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(location);
          expect(locationMongoRepository.create).toHaveBeenCalledTimes(1);
          expect(locationMongoRepository.create).toHaveBeenCalledWith(location);
          done();
        },
      });
    });
  });

  describe('updateLocation', () => {
    it('should update a location', (done) => {
      // Act
      const result$ = locationMongoService.updateLocation(
        location._id,
        location,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(location);
          expect(locationMongoRepository.update).toHaveBeenCalledTimes(1);
          expect(locationMongoRepository.update).toHaveBeenCalledWith(
            location._id,
            location,
          );
          done();
        },
      });
    });
  });

  describe('getLocationById', () => {
    it('should get a location by id', (done) => {
      // Act
      const result$ = locationMongoService.getLocationById(location._id);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(location);
          expect(locationMongoRepository.findOneById).toHaveBeenCalledTimes(1);
          expect(locationMongoRepository.findOneById).toHaveBeenCalledWith(
            location._id,
          );
          done();
        },
      });
    });
  });

  describe('getAll', () => {
    it('should get all locations', (done) => {
      // Act
      const result$ = locationMongoService.getAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual([location]);
          expect(locationMongoRepository.findAll).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });
});
