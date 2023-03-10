import { IRepository } from '@INTERFACE/common';
import { ProductSchema } from './product.schema.interface';

export namespace IProductRepository {
  export type CreateData = Pick<
    ProductSchema.Aggregate,
    'description' | 'name' | 'price' | 'quantity' | 'store_id'
  >;

  export type UpdatableData = Partial<
    Pick<
      ProductSchema.Aggregate,
      'description' | 'name' | 'price' | 'quantity' | 'is_deleted'
    >
  >;
}

export interface IProductRepository
  extends IRepository<ProductSchema.Aggregate, string> {
  readonly count: () => Promise<number>;
  readonly create: (
    data: IProductRepository.CreateData,
  ) => Promise<ProductSchema.Aggregate>;
  readonly update: (
    data: IProductRepository.UpdatableData,
  ) => (id: string) => Promise<void>;
  readonly findMany: (page?: number) => Promise<ProductSchema.Aggregate[]>;
}
