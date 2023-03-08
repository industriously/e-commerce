import { DBClient } from '@INTERFACE/common';
import { IProductRepository, ProductSchema } from '@INTERFACE/product';
import { ProductMapper } from '@PRODUCT/domain';
import { List, map, pipeAsync, ProviderBuilder } from '@UTIL';
import { pipe } from 'rxjs';
import typia from 'typia';

export const ProductRepositoryFactory = (
  client: DBClient,
): IProductRepository => {
  const product = () => client.get().product;
  return ProviderBuilder<IProductRepository>({
    count() {
      return product().count({ where: { is_deleted: false } });
    },
    create(data) {
      return pipeAsync(
        typia.createAssertPrune<IProductRepository.CreateData>(),
        (data) => product().create({ data }),
        ProductMapper.toAggregate,
      )(data);
    },
    update(_data) {
      const data = typia.assertPrune(_data);
      return pipe(
        typia.createAssert<string>(),

        async (id) => {
          await product().updateMany({
            where: { id, is_deleted: false },
            data,
          });
        },
      );
    },
    async findMany(page = 1) {
      const take = 30;
      return pipeAsync(
        (_page: number) =>
          product().findMany({ take, skip: (_page - 1) * take }),
        List.map(ProductMapper.toAggregate),
      )(page);
    },
    findOne(include_deleted = false) {
      return pipeAsync(
        (id: string) => typia.assert(id),
        (id) =>
          product().findFirst({
            where: { id, is_deleted: include_deleted ? undefined : false },
          }),
        map(ProductMapper.toAggregate),
      );
    },
    save(aggregate) {
      return pipe(
        typia.createAssertPrune<ProductSchema.Aggregate>(),

        async (agg) => {
          const { id, description, name, price, quantity, is_deleted } = agg;
          await product().updateMany({
            where: { id },
            data: { description, name, price, quantity, is_deleted },
          });
          return agg;
        },
      )(aggregate);
    },
    remove(id) {
      return pipe(
        // validate input
        typia.createAssert<string>(),
        // inactivate user, and return none(void)
        async (id) => {
          await product().updateMany({
            where: { id },
            data: { is_deleted: false },
          });
        },
      )(id);
    },
  }).build();
};
