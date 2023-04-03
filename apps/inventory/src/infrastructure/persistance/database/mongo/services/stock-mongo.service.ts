import { Observable, map, mergeMap, of, switchMap, throwError } from 'rxjs';
import { StockMongoRepository } from '../repositories';
import { StockMongoModel } from '../models';
import { IStockDomainService } from 'apps/inventory/src/domain/services';
import { Injectable, NotFoundException } from '@nestjs/common';

/**
 * Servicio de dominio de stock en MongoDB
 *
 * @export
 * @class StockMongoService
 * @implements {IStockDomainService<StockMongoModel>}
 */
@Injectable()
export class StockMongoService implements IStockDomainService<StockMongoModel> {
  /**
   * Crea una instancia de StockMongoService
   *
   * @param {StockMongoRepository} stockMongoRepository Repositorio de stock en MongoDB
   * @memberof StockMongoService
   */
  constructor(private readonly stockMongoRepository: StockMongoRepository) {}

  /**
   * Buscar stock por id de producto y id de ubicación
   *
   * @param {string} productId Id de producto
   * @param {string} locationId Id de ubicación
   * @return  {Observable<StockMongoModel>} Observable de stock encontrado
   * @memberof StockMongoService
   */
  findByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Observable<StockMongoModel> {
    return this.stockMongoRepository.findAll().pipe(
      switchMap((stocks: StockMongoModel[]) => {
        const stock = stocks.filter((stock: StockMongoModel) => {
          return (
            stock.product._id.toString() === productId.toString() &&
            stock.locationId.toString() === locationId.toString()
          );
        });
        return stock.length > 0
          ? of(stock[0])
          : throwError(() => new NotFoundException('Stock not found'));
      }),
    );
  }

  /**
   * Crear stock
   *
   * @param {StockMongoModel} entity Stock
   * @return {Observable<StockMongoModel>} Observable de stock creado
   * @memberof StockMongoService
   */
  createStock(entity: StockMongoModel): Observable<StockMongoModel> {
    return this.stockMongoRepository.create(entity);
  }

  /**
   * Actualizar cantidad de stock
   *
   * @param {string} entityId Id de stock
   * @param {StockMongoModel} entity Stock
   * @return  {Observable<StockMongoModel>} Observable de stock actualizado
   * @memberof StockMongoService
   */
  updateQuantity(
    entityId: string,
    entity: StockMongoModel,
  ): Observable<StockMongoModel> {
    return this.stockMongoRepository.findOneById(entityId).pipe(
      mergeMap((stock: StockMongoModel) => {
        stock.quantity = entity.quantity;
        return this.stockMongoRepository.update(entityId, stock);
      }),
    );
  }

  /**
   * Encontrar todos los stocks por id de producto
   *
   * @param {string} productId Id de producto
   * @return {Observable<StockMongoModel[]>} Observable de los stocks encontrados
   * @memberof StockMongoService
   */
  findAllByProductId(productId: string): Observable<StockMongoModel[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoModel[]) => {
        return stocks.filter((stock: StockMongoModel) => {
          return stock.product._id.toString() === productId.toString();
        });
      }),
    );
  }

  /**
   * Encontrar todos los stocks por id de ubicación
   *
   * @param {string} locationId Id de ubicación
   * @return {Observable<StockMongoModel[]>} Observable de los stocks encontrados
   * @memberof StockMongoService
   */
  findAllByLocationId(locationId: string): Observable<StockMongoModel[]> {
    return this.stockMongoRepository.findAll().pipe(
      map((stocks: StockMongoModel[]) => {
        return stocks.filter((stock: StockMongoModel) => {
          return stock.locationId.toString() === locationId.toString();
        });
      }),
    );
  }

  findOneById(entityId: string): Observable<StockMongoModel> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
