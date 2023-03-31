import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { UpdatedLocationInfoPublisher } from '..';
import { LocationModel } from '../../../persistance/models';

describe('UpdatedLocationInfoPublisher', () => {
  let publisher: UpdatedLocationInfoPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdatedLocationInfoPublisher,
        {
          provide: 'STORAGE_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<UpdatedLocationInfoPublisher>(
      UpdatedLocationInfoPublisher,
    );
  });

  it('should create an instance of UpdatedLocationInfoPublisher', () => {
    expect(publisher).toBeInstanceOf(UpdatedLocationInfoPublisher);
  });

  it('should publish new product to client proxy', (done) => {
    const data: LocationModel = {
      id: '123',
      name: 'Test Location',
      description: 'A test product',
      price: 20,
      quantity: 10,
    } as unknown as LocationModel;

    publisher.publish(data).subscribe(() => {
      expect(mockClientProxy.emit).toBeCalledWith(
        'updated-location-info',
        JSON.stringify(data),
      );
      done();
    });
  });
});
