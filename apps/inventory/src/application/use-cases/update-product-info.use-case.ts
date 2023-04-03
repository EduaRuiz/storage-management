import { IProductDomainService } from '../../domain/services';
import { UpdatedProductInfoDomainEvent } from '../../domain/events/publishers';
import { IUpdateProductDomainDto } from '../../domain/dtos';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';

/**
 * Actualiza la información de un producto
 *
 * @export
 * @class UpdateProductInfoUseCase
 */
export class UpdateProductInfoUseCase {
  /**
   * Crea una instancia de UpdateProductInfoUseCase
   *
   * @param {IProductDomainService} product$ Servicio de dominio de productos
   * @param {UpdatedProductInfoDomainEvent<ProductDomainModel>} updatedProductInfoDomainEvent Evento de dominio de actualización de información de producto
   * @memberof UpdateProductInfoUseCase
   */
  constructor(
    private readonly product$: IProductDomainService,
    private readonly updatedProductInfoDomainEvent: UpdatedProductInfoDomainEvent<ProductDomainModel>,
  ) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {string} productId Identificador del producto
   * @param {IUpdateProductDomainDto} updateProductDto Datos de actualización del producto
   * @return {Observable<ProductDomainModel>} Observable con la información del producto actualizada
   * @memberof UpdateProductInfoUseCase
   */
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
