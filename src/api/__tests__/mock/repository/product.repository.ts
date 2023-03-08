import { IProductRepository } from '@INTERFACE/product';
import { createProduct, product_list } from '../data';
import { create, findOne, save, update } from './common';

export const ProductRepository: IProductRepository = {
  create: create(createProduct),
  update: update(product_list),
  findOne: findOne(product_list),
  save: save(product_list),
  async remove() {},
  async findMany(page = 1) {
    const take = 2;
    const start = (page - 2) * take;
    const end = start + 10;
    return product_list.slice(start, end);
  },
  async count() {
    return product_list.filter(({ is_deleted }) => is_deleted === false).length;
  },
};
