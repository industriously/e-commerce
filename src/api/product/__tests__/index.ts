import { IConnection } from '@nestia/fetcher';
import { createProduct, product_list } from 'src/api/__tests__/mock/data';
import { find } from './find';
import { findMany } from './find_many';

export namespace TestProduct {
  const ids = product_list.map(({ id }) => id);
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
}
