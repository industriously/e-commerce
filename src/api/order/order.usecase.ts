import { OrderRepository, OrderSchema, OrderUsecase } from '@INTERFACE/order';
import { ProductSchema } from '@INTERFACE/product';
import { TokenService } from '@INTERFACE/token';
import { CommandBus } from '@nestjs/cqrs';
import { FindManyProductCommand } from '@PRODUCT/application';
import { ProviderBuilder } from '@UTIL';
import imp from 'iamport-server-api';

export const OrderUsecaseProvider = (
  commandBus: CommandBus,
  repository: OrderRepository,
  tokenService: TokenService,
): OrderUsecase => {
  const authorize = async (
    store_id: string,
    user_id: string,
  ): Promise<void> => {
    // 권한이 없으면 오류 발생
  };
  return ProviderBuilder<OrderUsecase>({
    create(token) {
      const { id: orderer_id } = tokenService.getAccessTokenPayload(token);
      return async ({
        imp_uid,
        store_id,
        recipient,
        order_id,
        order_items,
      }) => {
        const ids = order_items.map(({ product_id }) => product_id);

        const products = await commandBus.execute<
          FindManyProductCommand,
          ProductSchema.Aggregate[]
        >(new FindManyProductCommand(ids));

        const order_item_inputs =
          order_items.map<OrderRepository.OrderItemCreateInput>(
            ({ product_id, quantity }) => {
              const product = products.find(({ id }) => id === product_id);
              if (product == null || product.store_id !== store_id) {
                throw Error('상품 정보를 찾을 수 없습니다.');
              }
              return {
                name: product.name,
                price: product.price,
                quantity,
                product_id,
              };
            },
          );

        const { response } = await imp.functional.payments.at(
          { host: '' },
          imp_uid,
        );
        if (response.merchant_uid !== order_id) {
          throw Error('잘못된 결제 정보입니다.');
        }

        const payment = {
          imp_uid,
          status: response.status,
          amount: response.amount,
        } satisfies OrderSchema.Payment;

        const total_price = order_item_inputs.reduce(
          (prev, curr) => curr.price * curr.quantity + prev,
          0,
        );

        if (payment.status !== 'paid' || payment.amount !== total_price) {
          throw Error('결제가 완료되지 않았습니다.');
        }

        await repository.create({
          id: order_id,
          payment,
          store_id,
          recipient,
          orderer_id,
          total_price,
          order_items: order_item_inputs,
          status: 'Ready',
        });
        return;
      };
    },
    confirm(token) {
      const { id: user_id } = tokenService.getIdTokenPayload(token);

      return async ({ order_id, type }) => {
        const { status, store_id } = await repository.findOneSimple(order_id);
        await authorize(store_id, user_id);
        if (status !== 'Ready') {
          throw Error('주문을 변경할 수 없습니다.');
        }
        if (type === 'Approve') {
          return repository.update(order_id)({ status: 'Approved' });
        }
        if (type === 'Reject') {
          return repository.update(order_id)({ status: 'Rejected' });
        }
      };
    },
    findOne(token) {
      const { id: user_id } = tokenService.getIdTokenPayload(token);
      return async (order_id) => {
        const order = await repository.findOne(order_id);
        if (user_id !== order.orderer_id) {
          throw Error('주문 정보를 찾을 수 없습니다.');
        }
        const store = { id: order.store_id, name: 'store_name' };
        return {
          ...order,
          store,
          created_at: order.created_at.toISOString(),
          updated_at: order.updated_at.toISOString(),
        };
      };
    },
  }).build();
};
