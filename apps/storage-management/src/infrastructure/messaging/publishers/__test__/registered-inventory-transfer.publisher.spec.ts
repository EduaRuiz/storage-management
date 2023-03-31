import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RegisteredInventoryTransferPublisher } from '..';
import { InventoryTransferModel } from '../../../persistance/models';

describe('RegisteredInventoryTransferPublisher', () => {
  let publisher: RegisteredInventoryTransferPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    // Arrange
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisteredInventoryTransferPublisher,
        {
          provide: 'STORAGE_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<RegisteredInventoryTransferPublisher>(
      RegisteredInventoryTransferPublisher,
    );
  });

  it('should create an instance of RegisteredInventoryTransferPublisher', () => {
    // Assert
    expect(publisher).toBeInstanceOf(RegisteredInventoryTransferPublisher);
  });

  it('should publish inventory movement to client proxy', (done) => {
    // Arrange
    const data: InventoryTransferModel = {
      id: '123',
      quantity: 10,
      productId: '456',
      locationId: '789',
    } as unknown as InventoryTransferModel;

    // Act
    publisher.publish(data).subscribe(() => {
      // Assert
      expect(mockClientProxy.emit).toBeCalledWith(
        'registered-inventory-transfer',
        JSON.stringify(data),
      );
      done();
    });
  });
});
