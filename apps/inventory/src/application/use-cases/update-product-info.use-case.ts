import { IProductDomainService } from '../../domain/services';
import { UpdatedProductInfoDomainEvent } from '../../domain/events/publishers';
import { IUpdateProductDomainDto } from '../../domain/dto';
import { Observable, map, switchMap, tap } from 'rxjs';
import { ProductDomainEntity } from '../../domain/entities';

export class UpdateProductInfoUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly updatedProductInfoDomainEvent: UpdatedProductInfoDomainEvent,
  ) {}

  execute(
    productId: string,
    updateProductDto: IUpdateProductDomainDto,
  ): Observable<ProductDomainEntity> {
    return this.product$.findOneById(productId).pipe(
      switchMap((product: ProductDomainEntity) => {
        const entity: ProductDomainEntity = { ...product, ...updateProductDto };
        return this.updateProductInfo(productId, entity);
      }),
    );
  }

  private updateProductInfo(
    productId: string,
    product: ProductDomainEntity,
  ): Observable<ProductDomainEntity> {
    return this.product$.update(productId, product).pipe(
      tap((product: ProductDomainEntity) => {
        this.updatedProductInfoDomainEvent.publish(product);
      }),
    );
  }
}
