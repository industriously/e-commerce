import { OrderSchema } from '@INTERFACE/order';

export namespace OrderBusiness {
  export const isPaid = (order: OrderSchema.Aggregate) =>
    order.payment_status === 'Paid';

  export const isUnPaid = (order: OrderSchema.Aggregate) =>
    order.payment_status === 'UnPaid';

  export const calculateTotalPrice = (items: OrderSchema.OrderItem[]): number =>
    items.reduce((prev, curr) => curr.price * curr.quantity + prev, 0);
}
