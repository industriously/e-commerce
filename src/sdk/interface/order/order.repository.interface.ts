import { IRepository } from '@INTERFACE/common';
import { OrderSchema } from './order.schema.interface';

export namespace IOrderRepository {
  export type FindManyFilter = Partial<
    Pick<
      OrderSchema.Aggregate,
      'orderer_id' | 'payment_status' | 'delivery_status'
    >
  >;
  export type CreateData = Pick<
    OrderSchema.Aggregate,
    'orderer_id' | 'order_items' | 'total_price'
  >;
}

export interface IOrderRepository
  extends IRepository<OrderSchema.Aggregate, string> {
  readonly findMany: (
    filter: IOrderRepository.FindManyFilter,
  ) => Promise<OrderSchema.Aggregate[]>;
  readonly create: (
    data: IOrderRepository.CreateData,
  ) => Promise<OrderSchema.Aggregate>;
}
