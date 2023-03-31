import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RegisteredNewProductPublisher } from '..';
import { ProductModel } from '../../../persistance/models';

describe('RegisteredNewProductPublisher', () => {
  let publisher: RegisteredNewProductPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisteredNewProductPublisher,
        {
          provide: 'INVENTORY_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<RegisteredNewProductPublisher>(
      RegisteredNewProductPublisher,
    );
  });

  it('should create an instance of RegisteredNewProductPublisher', () => {
    expect(publisher).toBeInstanceOf(RegisteredNewProductPublisher);
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
        'registered-new-product',
        JSON.stringify(data),
      );
      done();
    });
  });
});
