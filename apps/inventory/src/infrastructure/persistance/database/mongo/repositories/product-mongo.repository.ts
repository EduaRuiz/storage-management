import { IRepositoryBase } from './interfaces';
import {
  Observable,
  catchError,
  from,
  iif,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductMongoModel } from '../models';

export class ProductMongoRepository
  implements IRepositoryBase<ProductMongoModel>
{
  constructor(
    @InjectModel(ProductMongoModel.name)
    private productMongoModel: Model<ProductMongoModel>,
  ) {}

  create(entity: ProductMongoModel): Observable<ProductMongoModel> {
    return from(this.productMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Product create conflict', error.message);
      }),
    );
  }

  update(
    entityId: string,
    entity: ProductMongoModel,
  ): Observable<ProductMongoModel> {
    return this.findOneById(entityId).pipe(
      mergeMap(() => {
        return from(
          this.productMongoModel.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId },
            { new: true },
          ),
        ).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'Product update conflict',
              error.message,
            );
          }),
        );
      }),
    );
  }

  delete(entityId: string): Observable<ProductMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return from(
          this.productMongoModel.findByIdAndDelete(
            { _id: entityId },
            { new: true },
          ),
        );
      }),
    );
  }

  findAll(): Observable<ProductMongoModel[]> {
    return from(this.productMongoModel.find().exec()).pipe(
      map((entities: ProductMongoModel[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<ProductMongoModel> {
    return from(
      this.productMongoModel.findById({ _id: entityId.toString() }),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Product invalid ID format',
          error.message,
        );
      }),
      switchMap((product: ProductMongoModel) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Product not found')),
          of(product),
        ),
      ),
    );
  }
}
