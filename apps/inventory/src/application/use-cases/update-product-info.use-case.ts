import { IProductDomainService } from '../../domain/services';
import { UpdatedProductInfoDomainEvent } from '../../domain/events/publishers';
import { IUpdateProductDomainDto } from '../../domain/dtos';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';

export class UpdateProductInfoUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly updatedProductInfoDomainEvent: UpdatedProductInfoDomainEvent<ProductDomainModel>,
  ) {}

  execute(
    productId: string,
    updateProductDto: IUpdateProductDomainDto,
  ): Observable<ProductDomainModel> {
    return this.product$.findOneById(productId).pipe(
      switchMap((entity: ProductDomainModel) => {
        entity = {
          name: entity.name,
          description: entity.description,
          price: entity.price,
          ...updateProductDto,
          _id: productId,
        };
        return this.product$.update(productId, entity).pipe(
          tap((entity: ProductDomainModel) => {
            this.updatedProductInfoDomainEvent.publish(entity);
          }),
        );
      }),
    );
  }
}
