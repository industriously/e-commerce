import { IConnection } from '@nestia/fetcher';
import { TokenServiceFactory } from '@TOKEN';
import { config, jwtService } from 'src/api/__tests__/mock/provider';
import {
  order_list,
  product_list,
  user_list,
} from 'src/api/__tests__/mock/data';
import { create } from './create';
import { OrderSchema } from '@INTERFACE/order';

export namespace TestOrder {
  const tokenService = TokenServiceFactory(jwtService, config);
  const valid_tokens = user_list.map(tokenService.getAccessToken);
  const order_items: OrderSchema.OrderItem[] = product_list.map(
    ({ id, price, name }) => ({
      product_id: id,
      name,
      price,
      quantity: Math.round(Math.random() * 9 + 1),
    }),
  );

  export const test_create = (connection: IConnection) => () => {
    it('create order successfully', () =>
      create.test_success(connection)(valid_tokens[2])({
        order_items: order_items.slice(0, 4),
      }));

    it('If unpaid order exist', async () => {
      const user = user_list[8];
      const token = tokenService.getAccessToken(user);
      const items = order_items.slice(4, 7);

      const test_order = order_list[7];
      const origianl_id = test_order.orderer_id;
      const original_status = test_order.payment_status;

      (test_order.orderer_id as any) = user.id;
      (test_order.payment_status as any) = 'UnPaid';

      // test
      await create.test_unpaid_order_exist(connection)(token)({
        order_items: items,
      });

      (test_order.orderer_id as any) = origianl_id;
      (test_order.payment_status as any) = original_status;
    });

    it('If order item is invalid', async () => {
      const items = order_items.slice(2, 5);

      const ori_id = items[2].product_id;
      (items[2].product_id as any) = user_list[8].id;

      await create.test_invalid_order_item(connection)(valid_tokens[3])({
        order_items: items,
      });

      (items[2].product_id as any) = ori_id;
    });
  };
}
