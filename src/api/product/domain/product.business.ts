import { IProductRepository, ProductSchema } from '@INTERFACE/product';

export namespace ProductBusiness {
  export const update =
    (data: IProductRepository.UpdatableData) =>
    (target: ProductSchema.Aggregate): ProductSchema.Aggregate => {
      const description = data.description ?? target.description;
      const name = data.name ?? target.name;
      const price = data.price ?? target.price;
      const quantity = data.quantity ?? target.quantity;

      return { ...target, description, name, price, quantity };
    };
}
