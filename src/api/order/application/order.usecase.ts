import { TransactionMarker } from '@COMMON/decorator/lazy';
import { HttpExceptionFactory } from '@COMMON/exception';
import { IOrderRepository, IOrderUsecase, OrderSchema } from '@INTERFACE/order';
import { IProductRepository } from '@INTERFACE/product';
import { ITokenService } from '@INTERFACE/token';
import { OrderBusiness, OrderMapper } from '@ORDER/domain';
import { ProviderBuilder, pipeAsync, List, Nullish } from '@UTIL';

export const OrderUsecaseFactory = (
  tokenService: ITokenService,
  orderRepository: IOrderRepository,
  productRepository: IProductRepository,
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

        productRepository.findManyByIds,

        (products) =>
          order_items.map<OrderSchema.OrderItem>(({ product_id, quantity }) => {
            const target = products.find(({ id }) => product_id === id);
            const null_check = Nullish.throwIf(
              HttpExceptionFactory(
                'BadRequest',
                '잘못된 상품 정보를 포함하고 있습니다.',
              ),
            );
            const item = null_check(target);
            return {
              product_id,
              name: item.name,
              price: item.price,
              quantity,
            };
          }),

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
