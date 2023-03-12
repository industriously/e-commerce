import { OrderSchema } from './order.schema.interface';

export namespace OrderRepository {
  export type OrderItemCreateInput = Omit<OrderSchema.OrderItem, 'id'>;

  export interface CreateInput {
    readonly id: string;
    readonly store_id: string;
    readonly orderer_id: string;
    /**
     * @type uint
     * @minimum 0
     */
    readonly total_price: number;
    readonly status: OrderSchema.Status;
    readonly order_items: OrderItemCreateInput[];
    readonly recipient: OrderSchema.Recipient;
    readonly payment: OrderSchema.Payment;
  }

  export type OrderSimple = Pick<
    OrderSchema.Aggregate,
    'id' | 'status' | 'store_id'
  >;

  export type UpdateInput = Partial<
    Pick<OrderSchema.Aggregate, 'status' | 'payment'>
  >;
}

export interface OrderRepository {
  readonly findOneSimple: (
    order_id: string,
  ) => Promise<OrderRepository.OrderSimple>;

  readonly findOne: (order_id: string) => Promise<OrderSchema.Aggregate>;

  readonly create: (
    input: OrderRepository.CreateInput,
  ) => Promise<OrderSchema.Aggregate>;

  readonly update: (
    order_id: string,
  ) => (input: OrderRepository.UpdateInput) => Promise<void>;
}
