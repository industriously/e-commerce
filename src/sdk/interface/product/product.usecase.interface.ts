import { PaginatedResponse } from '@INTERFACE/common';
import { ProductSchema } from './product.schema.interface';

export namespace IProductUsecase {
  export type CreateData = Pick<
    ProductSchema.Aggregate,
    'name' | 'description' | 'price' | 'quantity' | 'store_id'
  >;

  export type UpdateData = Pick<
    ProductSchema.Aggregate,
    'name' | 'description' | 'price' | 'quantity'
  >;
}

export interface IProductUsecase {
  readonly findOne: (product_id: string) => Promise<ProductSchema.Detail>;
  readonly findMany: (
    page: number,
  ) => Promise<PaginatedResponse<ProductSchema.General>>;
  readonly create: (
    data: IProductUsecase.CreateData,
  ) => Promise<ProductSchema.Detail>;
  readonly update: (
    product_id: string,
    data: IProductUsecase.UpdateData,
  ) => Promise<ProductSchema.Detail>;
  readonly inActivate: (product_id: string) => Promise<void>;
}
