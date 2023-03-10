import { OrderSchema } from './order.schema.interface';

export namespace IOrderUsecase {
  export type OrderItem = Pick<
    OrderSchema.OrderItem,
    'product_id' | 'quantity'
  >;
  export type CreateData = {
    order_items: OrderItem[];
  };
}

export interface IOrderUsecase {
  readonly create: (
    token: string,
    data: IOrderUsecase.CreateData,
  ) => Promise<OrderSchema.Detail>;
}
