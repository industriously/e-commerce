import { HttpExceptionFactory } from '@COMMON/exception';
import { PaginatedResponse } from '@INTERFACE/common';
import {
  IProductRepository,
  IProductUsecase,
  ProductSchema,
} from '@INTERFACE/product';
import { ProductBusiness, ProductMapper } from '@PRODUCT/domain';
import { List, Nullish, pipeAsync, ProviderBuilder } from '@UTIL';

export const ProductUsecaseFactory = (
  repository: IProductRepository,
): IProductUsecase => {
  return ProviderBuilder<IProductUsecase>({
    findOne(product_id) {
      return pipeAsync(
        repository.findOne(),

        Nullish.throwIf(HttpExceptionFactory('NotFound')),

        ProductMapper.toDetail,
      )(product_id);
    },
    findMany(page) {
      return pipeAsync(
        repository.findMany,

        List.map(ProductMapper.toGeneral),

        (data): PaginatedResponse<ProductSchema.General> => ({
          data,
          page,
        }),
      )(page);
    },
    async create(data) {
      const product = await repository.create(data);
      return ProductMapper.toDetail(product);
    },
    async update(product_id, data) {
      return pipeAsync(
        repository.findOne(),

        Nullish.throwIf(HttpExceptionFactory('NotFound')),

        ProductBusiness.update(data),

        repository.save,

        ProductMapper.toDetail,
      )(product_id);
    },
    inActivate(product_id) {
      return repository.update({ is_deleted: true })(product_id);
    },
  }).build();
};
