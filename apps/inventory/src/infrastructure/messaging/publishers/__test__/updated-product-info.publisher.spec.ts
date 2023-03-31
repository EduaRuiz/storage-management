import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { UpdatedProductInfoPublisher } from '..';
import { ProductModel } from '../../../persistance/models';

describe('UpdatedProductInfoPublisher', () => {
  let publisher: UpdatedProductInfoPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdatedProductInfoPublisher,
        {
          provide: 'INVENTORY_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<UpdatedProductInfoPublisher>(
      UpdatedProductInfoPublisher,
    );
  });

  it('should create an instance of UpdatedProductInfoPublisher', () => {
    expect(publisher).toBeInstanceOf(UpdatedProductInfoPublisher);
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
        'updated-product-info',
        JSON.stringify(data),
      );
      done();
    });
  });
});
