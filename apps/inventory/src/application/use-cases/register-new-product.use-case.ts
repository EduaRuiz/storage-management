import { Observable } from 'rxjs';
import { ProductDomainEntity } from '../../domain/entities';
import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';

export class RegisterNewProductUseCase {
  constructor(
    private readonly productRepository: IProductDomainService<ProductDomainEntity>,
    private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  execute(product: ProductDomainEntity): Observable<ProductDomainEntity> {
    this.registeredNewProductDomainEvent.publish(product);
    return this.productRepository.create(product);
  }
}
