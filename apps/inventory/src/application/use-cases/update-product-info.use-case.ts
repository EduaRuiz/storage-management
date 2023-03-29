import { IProductDomainService } from '../../domain/services';
import { UpdatedProductInfoDomainEvent } from '../../domain/events/publishers';
import { IUpdateProductDomainDto } from '../../domain/dtos';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';

export class UpdateProductInfoUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly updatedProductInfoDomainEvent: UpdatedProductInfoDomainEvent,
  ) {}

  execute(
    productId: string,
    updateProductDto: IUpdateProductDomainDto,
  ): Observable<ProductDomainModel> {
    return this.product$.findOneById(productId).pipe(
      switchMap((product: ProductDomainModel) => {
        const entity: ProductDomainModel = { ...product, ...updateProductDto };
        return this.updateProductInfo(productId, entity);
      }),
    );
  }

  private updateProductInfo(
    productId: string,
    product: ProductDomainModel,
  ): Observable<ProductDomainModel> {
    return this.product$.update(productId, product).pipe(
      tap((product: ProductDomainModel) => {
        this.updatedProductInfoDomainEvent.publish(product).subscribe();
      }),
    );
  }
}
