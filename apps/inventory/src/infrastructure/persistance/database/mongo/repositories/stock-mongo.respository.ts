import {
  Observable,
  catchError,
  from,
  iif,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { StockMongoEntity } from '../schemas/stock-mongo.entity';
import { IRepositoryBase } from './interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class StockMongoRepository implements IRepositoryBase<StockMongoEntity> {
  constructor(
    @InjectRepository(StockMongoEntity)
    private stockMongoEntity: Repository<StockMongoEntity>,
  ) {}

  create(entity: StockMongoEntity): Observable<StockMongoEntity> {
    return from(this.stockMongoEntity.save(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Stock create conflict', error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: StockMongoEntity,
  ): Observable<StockMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((currentEntity: StockMongoEntity) => {
        entity = { ...currentEntity, ...entity, _id: currentEntity._id };
        return from(this.stockMongoEntity.save(entity)).pipe(
          catchError((error: Error) => {
            throw new ConflictException('Stock update conflict', error.message);
          }),
        );
      }),
    );
  }

  delete(entityId: string): Observable<StockMongoEntity> {
    return this.findOneById(entityId).pipe(
      switchMap((entity: StockMongoEntity) => {
        return from(this.stockMongoEntity.remove(entity));
      }),
    );
  }

  findAll(): Observable<StockMongoEntity[]> {
    return from(this.stockMongoEntity.find()).pipe(
      map((entities: StockMongoEntity[]) => {
        return entities;
      }),
    );
  }

  findBy(
    options: FindOptionsWhere<StockMongoEntity>,
  ): Observable<StockMongoEntity[]> {
    return from(this.stockMongoEntity.findBy(options));
  }

  findOneById(entityId: string): Observable<StockMongoEntity> {
    return from(this.stockMongoEntity.findOneById(entityId)).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product: StockMongoEntity) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Stock not found')),
          of(product),
        ),
      ),
    );
  }
}
