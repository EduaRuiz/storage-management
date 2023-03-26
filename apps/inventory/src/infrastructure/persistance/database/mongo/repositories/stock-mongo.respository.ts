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
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class StockMongoRepository implements IRepositoryBase<StockMongoEntity> {
  constructor(
    @InjectRepository(StockMongoEntity)
    private stockMongoEntity: Repository<StockMongoEntity>,
  ) {}

  create(entity: StockMongoEntity): Observable<StockMongoEntity> {
    return from(this.stockMongoEntity.save(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: StockMongoEntity,
  ): Observable<StockMongoEntity> {
    this.findOneById(entityId).pipe(
      map((currentEntity: StockMongoEntity) => {
        currentEntity = { ...currentEntity, ...entity, _id: entityId };
        entity = currentEntity;
      }),
    );
    return from(this.stockMongoEntity.save(entity));
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

  findOneById(entityId: string): Observable<StockMongoEntity> {
    return from(
      this.stockMongoEntity.findOne({
        where: { _id: entityId },
      }),
    ).pipe(
      catchError((error: Error) => {
        throw new NotFoundException(error.message);
      }),
      switchMap((product) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Product not found')),
          of(product),
        ),
      ),
    );
  }
}
