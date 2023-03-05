import { ProductSchema } from '@INTERFACE/product';
import typia from 'typia';

const created_at = new Date();
const updated_at = created_at;

export const createProduct = (): ProductSchema.Aggregate => {
  const primitive = typia.random<ProductSchema.Aggregate>();
  return {
    ...primitive,
    is_deleted: false,
    created_at,
    updated_at,
  };
};

export const product_list: ProductSchema.Aggregate[] = new Array(10)
  .fill(1)
  .map(createProduct);
