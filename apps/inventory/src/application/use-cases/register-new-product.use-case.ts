import { Observable, tap } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';
import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';
import { INewProductDomainDto } from '../../domain/dtos';

export class RegisterNewProductUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  execute(newProductDto: INewProductDomainDto): Observable<ProductDomainModel> {
    return this.product$.create(newProductDto).pipe(
      tap((product: ProductDomainModel) => {
        this.registeredNewProductDomainEvent.publish(product);
      }),
    );
  }
}
