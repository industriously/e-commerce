import { Authorization } from '@COMMON/decorator/http';
import { IOrderUsecase, OrderSchema } from '@INTERFACE/order';
import { Body, Controller, Post, Inject } from '@nestjs/common';
import { OrderUsecaseToken } from '@ORDER/_constants_';
import typia from 'typia';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(OrderUsecaseToken) private readonly usecase: IOrderUsecase,
  ) {}

  /**
   * 주문 생성 요청 API
   *
   * @tag order
   * @param token 사용자 access token
   * @param body 주문 목록
   * @returns 생성된 주문 정보
   * @throw 400 잘못된 토큰입니다.
   * @throw 404 이미 결제 대기중인 주문이 있습니다.
   */
  @Post()
  create(
    @Authorization('bearer') token: string,
    @Body() body: IOrderUsecase.CreateData,
  ): Promise<OrderSchema.Detail> {
    const data = typia.assertPrune(body);
    return this.usecase.create(token, data);
  }
}
