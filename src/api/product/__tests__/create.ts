import { IConnection } from '@nestia/fetcher';
import { ProductUsecase } from '@INTERFACE/product';
import { products } from 'src/sdk/functional';
import typia from 'typia';

export namespace create {
  const api = (connection: IConnection) => (body: ProductUsecase.CreateData) =>
    products.create(connection, body);

  export const test_success =
    (connection: IConnection) => async (body: ProductUsecase.CreateData) => {
      const received = await api(connection)(body);

      typia.assertEquals(received);
    };
}
