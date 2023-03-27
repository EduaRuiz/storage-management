import { Observable } from 'rxjs';
import { ProductDomainEntity } from '../../domain/entities';
import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';
import { INewProductDomainDto } from '../../domain/dto';

export class RegisterNewProductUseCase {
  constructor(
    private readonly productRepository: IProductDomainService<ProductDomainEntity>,
    private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  execute(
    newProductDto: INewProductDomainDto,
  ): Observable<ProductDomainEntity> {
    this.registeredNewProductDomainEvent.publish(newProductDto);
    return this.productRepository.create(newProductDto);
  }
}
