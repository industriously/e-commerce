import { OrderSchema } from './order.schema.interface';

export namespace OrderUsecase {
  export type OrderItemCreateInput = Pick<
    OrderSchema.OrderItem,
    'product_id' | 'quantity'
  >;

  export interface CreateInput {
    readonly imp_uid: string;
    readonly order_id: string;
    readonly store_id: string;
    readonly recipient: OrderSchema.Recipient;
    readonly order_items: OrderItemCreateInput[];
  }

  export interface ConfirmInput {
    readonly order_id: string;
    readonly type: 'Approve' | 'Reject';
  }
}

export interface OrderUsecase {
  readonly create: (
    token: string,
  ) => (input: OrderUsecase.CreateInput) => Promise<void>;
  readonly confirm: (
    token: string,
  ) => (input: OrderUsecase.ConfirmInput) => Promise<void>;
  readonly findOne: (
    token: string,
  ) => (order_id: string) => Promise<OrderSchema.Detail>;
}
