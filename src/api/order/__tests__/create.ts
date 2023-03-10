import { IOrderUsecase } from '@INTERFACE/order';
import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import { test_error } from 'src/api/__tests__/common';
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

  export const test_unpaid_order_exist =
    (connection: IConnection) => (token: string) =>
      test_error(api(connection)(token))((err) => {
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('이미 결제 대기중인 주문이 있습니다.');
      });

  export const test_invalid_order_item =
    (connection: IConnection) => (token: string) =>
      test_error(api(connection)(token))((err) => {
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('잘못된 상품 정보를 포함하고 있습니다.');
      });
}
