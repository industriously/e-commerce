import { IOrderRepository } from '@INTERFACE/order';
import { createOrder, order_list } from '../data';
import { create, findOne, save } from './common';

export const OrderRepository: IOrderRepository = {
  async findMany({ orderer_id, payment_status, delivery_status }) {
    return order_list.filter((order) => {
      if (orderer_id && orderer_id !== order.orderer_id) {
        return false;
      }
      if (payment_status && payment_status !== order.payment_status) {
        return false;
      }
      if (delivery_status && delivery_status !== order.delivery_status) {
        return false;
      }
      return true;
    });
  },
  create: create(createOrder),
  findOne: findOne(order_list),
  save: save(order_list),
  remove: async () => {},
};
