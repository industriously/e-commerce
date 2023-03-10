import { OrderSchema } from '@INTERFACE/order';
import typia from 'typia';

const created_at = new Date();
const updated_at = created_at;
export const createOrder = (): OrderSchema.Aggregate => {
  const primitive = typia.random<OrderSchema.Aggregate>();
  return {
    ...primitive,
    is_deleted: false,
    created_at,
    updated_at,
  };
};

export const order_list: OrderSchema.Aggregate[] = new Array(10)
  .fill(1)
  .map(createOrder);
