import { IRepository } from '@INTERFACE/common';
import { OrderSchema } from './order.schema.interface';

export namespace IOrderRepository {
  export type FindManyFilter = Partial<
    Pick<OrderSchema.Aggregate, 'payment_status' | 'delivery_status'> &
      Pick<OrderSchema.Orderer, 'orderer_id'>
  >;
  export type CreateData = Pick<
    OrderSchema.Aggregate,
    'orderer' | 'order_items' | 'total_price'
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
