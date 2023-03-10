import { TransactionMarker } from '@COMMON/decorator/lazy';
import { HttpExceptionFactory } from '@COMMON/exception';
import { IOrderRepository, IOrderUsecase, OrderSchema } from '@INTERFACE/order';
import { ITokenService } from '@INTERFACE/token';
import { OrderBusiness, OrderMapper } from '@ORDER/domain';
import { ProviderBuilder, pipeAsync, List } from '@UTIL';

export const OrderUsecaseFactory = (
  tokenService: ITokenService,
  orderRepository: IOrderRepository,
): IOrderUsecase => {
  return ProviderBuilder<IOrderUsecase>({
    async create(token, data) {
      // 사용자 권한 확인 과정
      const { id } = tokenService.getAccessTokenPayload(token);

      // 결제 대기중인 주문 여부 확인
      const list = await orderRepository.findMany({
        orderer_id: id,
        payment_status: 'UnPaid',
      });

      if (list.length > 0) {
        throw HttpExceptionFactory(
          'BadRequest',
          '이미 결제 대기중인 주문이 있습니다.',
        );
      }
      const { order_items } = data;

      // 주문 생성
      return pipeAsync(
        List.map<IOrderUsecase.OrderItem, string>(
          ({ product_id }) => product_id,
        ),

        orderRepository.findManyProductsByIds,

        List.map<IOrderRepository.Product, OrderSchema.OrderItem>(
          ({ id: product_id, name, price }) => {
            const item = order_items.find(
              (item) => item.product_id === product_id,
            );
            return { product_id, name, price, quantity: item?.quantity ?? 0 };
          },
        ),

        (items) =>
          orderRepository.create({
            orderer_id: id,
            order_items: items,
            total_price: OrderBusiness.calculateTotalPrice(items),
          }),

        // 결제 금액 사전 등록 과정 추가

        OrderMapper.toDetail,
      )(order_items);
    },
  })
    .mark('create', TransactionMarker())
    .build();
};
