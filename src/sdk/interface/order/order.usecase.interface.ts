import { OrderSchema } from './order.schema.interface';

export namespace IOrderUsecase {
  export type Orderer = Pick<OrderSchema.Orderer, 'name' | 'phone' | 'address'>;

  export type OrderItem = Pick<
    OrderSchema.OrderItem,
    'product_id' | 'quantity'
  >;
  export type CreateData = {
    order_items: OrderItem[];
    orderer: Orderer;
  };
}

export interface IOrderUsecase {
  readonly create: (
    token: string,
    data: IOrderUsecase.CreateData,
  ) => Promise<OrderSchema.Detail>;
}
