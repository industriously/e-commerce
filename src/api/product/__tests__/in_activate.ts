import { IConnection } from '@nestia/fetcher';
import { products } from 'src/sdk/functional';
export namespace inActivate {
  export const test_success =
    (connection: IConnection) => (product_id: string) =>
      products.inActivate(connection, product_id);
}
