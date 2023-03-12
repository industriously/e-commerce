import { ProductUsecase } from '@INTERFACE/product';
import { IConnection } from '@nestia/fetcher';
import { ProductBusiness } from '@PRODUCT/domain';
import { createProduct, product_list } from 'src/api/__tests__/mock/data';
import typia from 'typia';
import { count } from './count';
import { create } from './create';
import { find } from './find';
import { findMany } from './find_many';
import { inActivate } from './in_activate';
import { update } from './update';

export namespace TestProduct {
  const ids = product_list.map(({ id }) => id);
  const test_product_list = product_list.map(createProduct);
  export const test_find = (connection: IConnection) => () => {
    it.each(['2e21d2', '123214'])(
      'If product_id is not uuid type',
      find.test_invalid_params(connection),
    );

    it.each(ids)('If product exists', find.test_success(connection));

    it.each([createProduct().id, createProduct().id])(
      'If product not exists',
      find.test_product_not_found(connection),
    );
  };

  export const test_find_many = (connection: IConnection) => () => {
    it('If query is empty', () => findMany.test_success(connection)());

    it.each([-1, 0, 0.5, 1.2, 1.3, 4.2])(
      'If query is not int or not more than 0',
      findMany.test_page_not_int(connection),
    );

    it.each([1, 2.0, 3.0, 4, 5, 6, 7])(
      'If page is int and more than 0',
      findMany.test_success(connection),
    );
  };

  export const test_count = (connection: IConnection) => () => {
    it('get count', count.test_success(connection));
  };

  export const test_create = (connection: IConnection) => () => {
    const bodys = product_list.map(
      typia.createRandom<ProductUsecase.CreateData>(),
    );
    it.each(bodys)(
      'create product successfully',
      create.test_success(connection),
    );
  };

  export const test_update = (connection: IConnection) => () => {
    const test_bodys = product_list.map(
      typia.createRandom<ProductUsecase.UpdateData>(),
    );
    it.each(product_list)('If active product exist', async (product) => {
      const api = update.test_success(connection)(product.id);
      for (const body of test_bodys) {
        await api(body);
        for (const [key, value] of Object.entries(body)) {
          if (value !== undefined)
            expect(product[key as keyof ProductUsecase.UpdateData]).toBe(value);
        }
      }
    });
    it.each(product_list)('If product is inActive', async (product) => {
      ProductBusiness.inActivate(product);
      await update.test_product_not_found(connection)(test_bodys[0])(
        product.id,
      );
      ProductBusiness.activate(product);
    });

    it.each(test_product_list.map(({ id }) => id))(
      'If product not exist',
      update.test_product_not_found(connection)(test_bodys[1]),
    );
  };

  export const test_in_active = (connection: IConnection) => () => {
    it.each(product_list)('If active product exist', async (product) => {
      ProductBusiness.activate(product);
      await inActivate.test_success(connection)(product.id);
      expect(ProductBusiness.isInAcitve(product)).toBe(true);
      ProductBusiness.activate(product);
    });
    it.each(test_product_list.map(({ id }) => id))(
      'If product not exist',
      inActivate.test_success(connection),
    );
    it.each(product_list)('If product is inActive', async (product) => {
      ProductBusiness.inActivate(product);
      await inActivate.test_success(connection)(product.id);
      expect(ProductBusiness.isInAcitve(product)).toBe(true);
      ProductBusiness.activate(product);
    });
  };
}
