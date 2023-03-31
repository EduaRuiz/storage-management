import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RemovedProductPublisher } from '..';
import { ProductModel } from '../../../persistance/models';

describe('RemovedProductPublisher', () => {
  let publisher: RemovedProductPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        RemovedProductPublisher,
        {
          provide: 'INVENTORY_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<RemovedProductPublisher>(RemovedProductPublisher);
  });

  it('should create an instance of RemovedProductPublisher', () => {
    expect(publisher).toBeInstanceOf(RemovedProductPublisher);
  });

  it('should publish new product to client proxy', (done) => {
    const data: ProductModel = {
      id: '123',
      name: 'Test Product',
      description: 'A test product',
      price: 20,
      quantity: 10,
    } as unknown as ProductModel;

    publisher.publish(data).subscribe(() => {
      expect(mockClientProxy.emit).toBeCalledWith(
        'removed-product',
        JSON.stringify(data),
      );
      done();
    });
  });
});
