import { ProductDomainEntity } from '../../entities';

export abstract class RegisteredNewProductDomainEvent<
  Response = ProductDomainEntity,
> {
  publish(product: ProductDomainEntity): Response {
    return this.execute(product);
  }
  execute(product: ProductDomainEntity): Response {
    throw new Error('Method not implemented.');
  }
}
