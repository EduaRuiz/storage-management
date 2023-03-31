import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RegisteredNewLocationPublisher } from '..';
import { LocationModel } from '../../../persistance/models';

describe('RegisteredNewLocationPublisher', () => {
  let publisher: RegisteredNewLocationPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisteredNewLocationPublisher,
        {
          provide: 'STORAGE_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<RegisteredNewLocationPublisher>(
      RegisteredNewLocationPublisher,
    );
  });

  it('should create an instance of RegisteredNewLocationPublisher', () => {
    expect(publisher).toBeInstanceOf(RegisteredNewLocationPublisher);
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
        'registered-new-location',
        JSON.stringify(data),
      );
      done();
    });
  });
});
