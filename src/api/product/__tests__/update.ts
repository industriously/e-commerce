import { HttpExceptionMessage } from '@COMMON/exception';
import { ProductUsecase } from '@INTERFACE/product';
import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import { test_error } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';
import typia from 'typia';

export namespace update {
  const api =
    (connection: IConnection) =>
    (body: ProductUsecase.UpdateData) =>
    (product_id: string) =>
      products.update(connection, product_id, body);

  export const test_success =
    (connection: IConnection) =>
    (product_id: string) =>
    async (body: ProductUsecase.UpdateData) => {
      const received = await api(connection)(body)(product_id);

      typia.assertEquals(received);
    };

  export const test_product_not_found =
    (connection: IConnection) => (body: ProductUsecase.UpdateData) =>
      test_error(api(connection)(body))((err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe(HttpExceptionMessage.NF);
      });
}
