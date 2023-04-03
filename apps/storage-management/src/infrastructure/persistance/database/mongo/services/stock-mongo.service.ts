import { Observable, mergeMap, of, switchMap, throwError } from 'rxjs';
import { StockMongoRepository } from '../repositories';
import { StockMongoModel } from '../models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IStockDomainService } from 'apps/storage-management/src/domain/services';

/**
 * Servicio de stock en MongoDB
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
   * Busca un stock por id de ubicación y id de producto
   *
   * @param {string} locationId Id de la ubicación
   * @param {string} productId Id del producto
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoService
   */
  findOneByLocationIdAndProductId(
    locationId: string,
    productId: string,
  ): Observable<StockMongoModel> {
    return this.stockMongoRepository.findAll().pipe(
      switchMap((stocks: StockMongoModel[]) => {
        const stock = stocks.filter((stock: StockMongoModel) => {
          return (
            stock.productId.toString() === productId.toString() &&
            stock.location._id.toString() === locationId.toString()
          );
        });
        return stock.length > 0
          ? of(stock[0])
          : throwError(() => new NotFoundException('Stock not found'));
      }),
    );
  }

  /**
   * Crea un stock
   *
   * @param {StockMongoModel} entity Stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoService
   */
  createStock(entity: StockMongoModel): Observable<StockMongoModel> {
    return this.stockMongoRepository.create(entity);
  }

  /**
   * Actualiza la cantidad producto en un stock
   *
   * @param {string} entityId Id del stock
   * @param {StockMongoModel} entity Stock
   * @return  {Observable<StockMongoModel>} Observable de stock
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
   * Obtiene un stock por su id
   *
   * @param {string} entityId Id del stock
   * @return {Observable<StockMongoModel>} Observable de stock
   * @memberof StockMongoService
   */
  findOneById(entityId: string): Observable<StockMongoModel> {
    return this.stockMongoRepository.findOneById(entityId);
  }
}
