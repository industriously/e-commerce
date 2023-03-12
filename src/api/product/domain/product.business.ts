import { ProductRepository, ProductSchema } from '@INTERFACE/product';
import { Predicate } from '@UTIL';

export namespace ProductBusiness {
  export const update =
    (data: Omit<ProductRepository.UpdatableData, 'is_deleted'>) =>
    (target: ProductSchema.Aggregate): ProductSchema.Aggregate => {
      (target as any).description = data.description ?? target.description;
      (target as any).name = data.name ?? target.name;
      (target as any).price = data.price ?? target.price;
      (target as any).quantity = data.quantity ?? target.quantity;

      return target;
    };

  export const activate = (
    target: ProductSchema.Aggregate,
  ): ProductSchema.Aggregate => {
    (target as any).is_deleted = false;
    return target;
  };

  export const inActivate = (
    target: ProductSchema.Aggregate,
  ): ProductSchema.Aggregate => {
    (target as any).is_deleted = true;
    return target;
  };

  export const isAcitve = (target: ProductSchema.Aggregate): boolean => {
    return !target.is_deleted;
  };

  export const isInAcitve = (target: ProductSchema.Aggregate): boolean => {
    return Predicate.negate(isAcitve)(target);
  };
}
