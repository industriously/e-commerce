import { IConnection } from '@nestia/fetcher';
import { products } from 'src/sdk/functional';
import typia from 'typia';

interface CountType {
  /**
   * @type uint
   * @minimum 0
   */
  count: number;
}

export namespace count {
  const api = (connection: IConnection) => () =>
    products.count.getCount(connection);

  export const test_success = (connection: IConnection) => async () => {
    const received = await api(connection)();

    typia.assert<CountType>({ count: received }); // test if received is int, and not less than 0
  };
}
