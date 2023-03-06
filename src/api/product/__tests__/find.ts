import { HttpExceptionMessage } from '@COMMON/exception';
import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import { test_error } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';
import typia from 'typia';

export namespace find {
  const api = (connection: IConnection) => (product_id: string) =>
    products.find(connection, product_id);

  export const test_success =
    (connection: IConnection) => async (id: string) => {
      const received = await api(connection)(id);

      typia.assertEquals(received);
    };

  export const test_product_not_found = (connection: IConnection) =>
    test_error(api(connection))((err) => {
      expect(err.status).toBe(HttpStatus.NOT_FOUND);
      expect(err.message).toEqual(HttpExceptionMessage.NF);
    });

  export const test_invalid_params = (connection: IConnection) =>
    test_error(api(connection))((err) => {
      expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      expect(err.message).toEqual(
        'Value of the URL parameter "product_id" is not a valid UUID.',
      );
    });
}
