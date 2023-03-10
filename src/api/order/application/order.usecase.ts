import { TransactionMarker } from '@COMMON/decorator/lazy';
import { HttpExceptionFactory } from '@COMMON/exception';
import { IOrderRepository, IOrderUsecase, OrderSchema } from '@INTERFACE/order';
import { ProductSchema } from '@INTERFACE/product';
import { ITokenService } from '@INTERFACE/token';
import { CommandBus } from '@nestjs/cqrs';
import { OrderBusiness, OrderMapper } from '@ORDER/domain';
import { FindManyProductCommand } from '@PRODUCT/application';
import { ProviderBuilder, Nullish } from '@UTIL';

export const OrderUsecaseFactory = (
  commandBus: CommandBus,
  orderRepository: IOrderRepository,
  tokenService: ITokenService,
): IOrderUsecase => {
  const check_unpaid_order_exist = async (orderer_id: string) => {
    const list = await orderRepository.findMany({
      orderer_id,
      payment_status: 'UnPaid',
    });
    if (list.length > 0) {
      throw HttpExceptionFactory(
        'BadRequest',
        '이미 결제 대기중인 주문이 있습니다.',
      );
    }
    return;
  };
  const create_orderer_vo =
    (orderer_id: string) =>
    (data: IOrderUsecase.Orderer): OrderSchema.Orderer =>
      ({
        orderer_id,
        name: data.name,
        phone: data.phone,
        address: data.address,
      } satisfies OrderSchema.Orderer);

  const create_order_item_vo_list = async (
    items: IOrderUsecase.OrderItem[],
  ): Promise<OrderSchema.OrderItem[]> => {
    const ids = items.map(({ product_id }) => product_id);

    const products = await commandBus.execute<
      FindManyProductCommand,
      ProductSchema.Aggregate[]
    >(new FindManyProductCommand(ids));

    return items.map<OrderSchema.OrderItem>(({ product_id, quantity }) => {
      const product = products.find(({ id }) => product_id === id);
      const null_check = Nullish.throwIf(
        HttpExceptionFactory(
          'BadRequest',
          '잘못된 상품 정보를 포함하고 있습니다.',
        ),
      );
      const item = null_check(product);
      return {
        product_id,
        name: item.name,
        price: item.price,
        quantity,
      };
    });
  };
  return ProviderBuilder<IOrderUsecase>({
    async create(token, data) {
      // 사용자 권한 확인 과정
      const { id: orderer_id } = tokenService.getAccessTokenPayload(token);

      // 결제 대기중인 주문 여부 확인
      await check_unpaid_order_exist(orderer_id);

      const { order_items, orderer } = data;

      // 주문 생성
      const items = await create_order_item_vo_list(order_items);
      const order = await orderRepository.create({
        orderer: create_orderer_vo(orderer_id)(orderer),
        order_items: items,
        total_price: OrderBusiness.calculateTotalPrice(items),
      });

      // 결제 금액 사전 등록 과정 추가

      return OrderMapper.toDetail(order);
    },
  })
    .mark('create', TransactionMarker())
    .build();
};
