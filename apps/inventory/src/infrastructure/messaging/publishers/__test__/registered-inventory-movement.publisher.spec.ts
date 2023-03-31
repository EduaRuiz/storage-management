import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RegisteredInventoryMovementPublisher } from '..';
import { InventoryMovementModel } from '../../../persistance/models';

describe('RegisteredInventoryMovementPublisher', () => {
  let publisher: RegisteredInventoryMovementPublisher;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    // Arrange
    mockClientProxy = {
      emit: jest.fn(() => of({})),
    } as unknown as jest.Mocked<ClientProxy>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisteredInventoryMovementPublisher,
        {
          provide: 'INVENTORY_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    publisher = moduleRef.get<RegisteredInventoryMovementPublisher>(
      RegisteredInventoryMovementPublisher,
    );
  });

  it('should create an instance of RegisteredInventoryMovementPublisher', () => {
    // Assert
    expect(publisher).toBeInstanceOf(RegisteredInventoryMovementPublisher);
  });

  it('should publish inventory movement to client proxy', (done) => {
    // Arrange
    const data: InventoryMovementModel = {
      id: '123',
      quantity: 10,
      productId: '456',
      locationId: '789',
    } as unknown as InventoryMovementModel;

    // Act
    publisher.publish(data).subscribe(() => {
      // Assert
      expect(mockClientProxy.emit).toBeCalledWith(
        'registered-inventory-movement',
        JSON.stringify(data),
      );
      done();
    });
  });
});
