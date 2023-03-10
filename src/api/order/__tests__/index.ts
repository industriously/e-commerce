import { IConnection } from '@nestia/fetcher';
import { TokenServiceFactory } from '@TOKEN';
import { config, jwtService } from 'src/api/__tests__/mock/provider';
import { product_list, user_list } from 'src/api/__tests__/mock/data';
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
  };
}
