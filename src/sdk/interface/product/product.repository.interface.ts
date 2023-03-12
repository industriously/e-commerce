import { IRepository } from '@INTERFACE/common';
import { ProductSchema } from './product.schema.interface';

export namespace ProductRepository {
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

export interface ProductRepository
  extends IRepository<ProductSchema.Aggregate, string> {
  readonly findMany: (page?: number) => Promise<ProductSchema.Aggregate[]>;
  readonly findManyByIds: (ids: string[]) => Promise<ProductSchema.Aggregate[]>;
  readonly count: () => Promise<number>;
  readonly create: (
    data: ProductRepository.CreateData,
  ) => Promise<ProductSchema.Aggregate>;
  readonly update: (
    data: ProductRepository.UpdatableData,
  ) => (id: string) => Promise<void>;
}
