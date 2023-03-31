import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from '..';
import {
  InventoryTransferService,
  LocationService,
  StockService,
} from '../../persistance/services';
import { ProductExistService } from '../../utils/services';
import {
  GetLocationInfoUseCase,
  RegisterInventoryTransferUseCase,
  RegisterNewLocationUseCase,
  UpdateLocationInfoUseCase,
} from '@storage/application/use-cases';
import { InventoryTransferDto, NewLocationDto } from '../../utils/dtos';
import {
  InventoryTransferDomainModel,
  LocationDomainModel,
} from 'apps/storage-management/src/domain/models';
import { of } from 'rxjs';
import {
  RegisteredInventoryTransferPublisher,
  RegisteredNewLocationPublisher,
  UpdatedLocationInfoPublisher,
} from '@storage/infrastructure/messaging/publishers';

describe('StorageController', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: LocationService,
          useValue: {},
        },
        {
          provide: StockService,
          useValue: {},
        },
        {
          provide: InventoryTransferService,
          useValue: {},
        },
        {
          provide: ProductExistService,
          useValue: {},
        },
        {
          provide: RegisteredNewLocationPublisher,
          useValue: {},
        },
        {
          provide: UpdatedLocationInfoPublisher,
          useValue: {},
        },
        {
          provide: RegisteredInventoryTransferPublisher,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  describe('registerNewLocation', () => {
    it('should register a new location and return a location domain model', (done) => {
      // Arrange
      const newLocationDto = {
        name: 'test location',
        description: 'test description',
      } as NewLocationDto;
      const expectedLocation = {
        _id: 'test-id',
        name: 'test location',
        description: 'test description',
      } as unknown as LocationDomainModel;
      const registerNewLocationUseCaseExecuteSpy = jest
        .spyOn(RegisterNewLocationUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedLocation));

      // Act
      const result = controller.registerNewLocation(newLocationDto);

      // Assert
      expect(registerNewLocationUseCaseExecuteSpy).toHaveBeenCalledTimes(1);
      expect(registerNewLocationUseCaseExecuteSpy).toHaveBeenCalledWith(
        newLocationDto,
      );

      result.subscribe({
        next: (value: LocationDomainModel) => {
          expect(value).toEqual(expectedLocation);
          done();
        },
      });
    });
  });

  describe('getLocationInfo', () => {
    it('should get the location info and return a location domain model', (done) => {
      // Arrange
      const locationId = 'test-id';
      const expectedLocation = {
        _id: 'test-id',
        name: 'test location',
        description: 'test description',
      } as unknown as LocationDomainModel;
      const getLocationInfoUseCaseExecuteSpy = jest
        .spyOn(GetLocationInfoUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedLocation));

      // Act
      const result = controller.getLocationInfo(locationId);

      // Assert
      expect(getLocationInfoUseCaseExecuteSpy).toHaveBeenCalledTimes(1);
      expect(getLocationInfoUseCaseExecuteSpy).toHaveBeenCalledWith(locationId);
      result.subscribe({
        next: (value: LocationDomainModel) => {
          expect(value).toEqual(expectedLocation);
          done();
        },
      });
    });
  });

  describe('registerInventoryTransfer', () => {
    it('should register an inventory transfer and return a location domain model', (done) => {
      // Arrange
      const authHeader = 'Bearer token';
      const inventoryTransferDto = {
        locationId: 'test-id',
      } as unknown as InventoryTransferDto;
      const expectedInventoryMovement = {
        _id: 'test-id',
      } as unknown as InventoryTransferDomainModel;
      const execute = jest
        .spyOn(RegisterInventoryTransferUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedInventoryMovement));

      // Act
      const result = controller.registerInventoryTransfer(
        authHeader,
        inventoryTransferDto,
      );

      // Assert
      expect(execute).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledWith(inventoryTransferDto, 'token');
      result.subscribe({
        next: (value: InventoryTransferDomainModel) => {
          expect(value).toEqual(expectedInventoryMovement);
          done();
        },
      });
    });
  });

  describe('updateLocationInfo', () => {
    it('should update the location info and return a location domain model', (done) => {
      // Arrange
      const locationId = 'test-id';
      const locationDto = {
        name: 'test location',
        description: 'test description',
      } as NewLocationDto;
      const expectedLocation = {
        _id: 'test-id',
        name: 'test location',
        description: 'test description',
      } as unknown as LocationDomainModel;
      const execute = jest
        .spyOn(UpdateLocationInfoUseCase.prototype, 'execute')
        .mockReturnValue(of(expectedLocation));

      // Act
      const result = controller.updateLocation(locationDto, locationId);

      // Assert
      expect(execute).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledWith(locationId, locationDto);
      result.subscribe({
        next: (value: LocationDomainModel) => {
          expect(value).toEqual(expectedLocation);
          done();
        },
      });
    });
  });
});
