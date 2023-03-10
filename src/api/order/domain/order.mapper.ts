import { OrderSchema } from '@INTERFACE/order';
import { UnaryFunction } from 'rxjs';

export namespace OrderMapper {
  export const toDetail: UnaryFunction<
    OrderSchema.Aggregate,
    OrderSchema.Detail
  > = (order) => {
    return {
      ...order,
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    };
  };
}
