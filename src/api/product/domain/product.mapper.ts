import { ProductSchema } from '@INTERFACE/product';
import { Product } from '@PRISMA';
import { UnaryFunction } from 'rxjs';

export namespace ProductMapper {
  export const toAggregate: UnaryFunction<Product, ProductSchema.Aggregate> = (
    model,
  ) => {
    return { ...model } satisfies ProductSchema.Aggregate;
  };
  export const toGeneral: UnaryFunction<
    ProductSchema.Aggregate,
    ProductSchema.General
  > = (product) => {
    const { id, name, store_id, price } = product;
    return { id, name, store_id, price } satisfies ProductSchema.General;
  };

  export const toDetail: UnaryFunction<
    ProductSchema.Aggregate,
    ProductSchema.Detail
  > = (product) => {
    const {
      id,
      name,
      store_id,
      description,
      price,
      quantity,
      created_at,
      updated_at,
    } = product;
    return {
      id,
      name,
      store_id,
      description,
      price,
      quantity,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
    } satisfies ProductSchema.Detail;
  };
}
