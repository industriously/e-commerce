import { IOrderUsecase } from '@INTERFACE/order';
import { IConnection } from '@nestia/fetcher';
import { orders } from 'src/sdk/functional';
import typia from 'typia';

export namespace create {
  const api =
    (connection: IConnection) =>
    (token: string) =>
    (body: IOrderUsecase.CreateData) => {
      const _connection: IConnection = {
        host: connection.host,
        headers: {
          ...(connection.headers ?? {}),
          Authorization: `bearer ${token}`,
        },
      };
      return orders.create(_connection, body);
    };

  export const test_success =
    (connection: IConnection) =>
    (token: string) =>
    async (body: IOrderUsecase.CreateData) => {
      const received = await api(connection)(token)(body);

      typia.assertPrune(received);
    };
}
