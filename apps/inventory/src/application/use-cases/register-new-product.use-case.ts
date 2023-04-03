import { Observable, tap } from 'rxjs';
import { ProductDomainModel } from '../../domain/models';
import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { IProductDomainService } from '../../domain/services';
import { INewProductDomainDto } from '../../domain/dtos';

/**
 * Registra un nuevo producto
 *
 * @export
 * @class RegisterNewProductUseCase
 */
export class RegisterNewProductUseCase {
  /**
   * Crea una instancia de RegisterNewProductUseCase
   *
   * @param {IProductDomainService} product$ Servicio de dominio de productos
   * @param {RegisteredNewProductDomainEvent} registeredNewProductDomainEvent Evento de dominio de registro de nuevo producto
   * @memberof RegisterNewProductUseCase
   */
  constructor(
    private readonly product$: IProductDomainService,
    private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param {INewProductDomainDto} newProductDto Datos del nuevo producto
   * @return  {Observable<ProductDomainModel>} Observable con el producto registrado
   * @memberof RegisterNewProductUseCase
   */
  execute(newProductDto: INewProductDomainDto): Observable<ProductDomainModel> {
    newProductDto.name = newProductDto.name.trim().toUpperCase();
    newProductDto.description = newProductDto.description.trim();
    return this.product$.create(newProductDto).pipe(
      tap((product: ProductDomainModel) => {
        this.registeredNewProductDomainEvent.publish(product);
      }),
    );
  }
}
