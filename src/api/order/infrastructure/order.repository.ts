import { IOrderRepository } from '@INTERFACE/order';
import { DBClient } from '@INTERFACE/common';
import { ProviderBuilder } from '@UTIL';

export const OrderRepositoryFactory = (client: DBClient): IOrderRepository => {
  // const order = () => client.get().order;
  return ProviderBuilder<IOrderRepository>({
    findMany(filter) {
      throw new Error('Function not implemented.');
    },
    findManyProductsByIds(ids) {
      throw new Error('Function not implemented.');
    },
    create(data) {
      throw new Error('Function not implemented.');
    },
    findOne(include_deleted = false) {
      throw new Error('Function not implemented.');
    },
    save(aggregate) {
      throw new Error('Function not implemented.');
    },
    remove(id) {
      throw new Error('Function not implemented.');
    },
  }).build();
};
