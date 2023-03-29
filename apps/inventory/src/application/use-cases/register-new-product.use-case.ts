import { Observable, tap } from 'rxjs';
import { ProductDomainEntity } from '../../domain/entities';
import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';
import { INewProductDomainDto } from '../../domain/dtos';

export class RegisterNewProductUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  execute(
    newProductDto: INewProductDomainDto,
  ): Observable<ProductDomainEntity> {
    return this.product$.create(newProductDto).pipe(
      tap((product: ProductDomainEntity) => {
        this.registeredNewProductDomainEvent.publish(product);
      }),
    );
  }
}
