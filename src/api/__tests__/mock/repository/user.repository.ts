import { IUserRepository } from '@INTERFACE/user';
import { createUser, user_list } from '../data';
import { create, findOne, save, update } from './common';

export const UserRepository: IUserRepository = {
  create: create(createUser),
  update: update(user_list),
  findOne: findOne(user_list),
  save: save(user_list),
  async remove() {},
  async findOneByOauth(filter) {
    return (
      user_list.find(
        ({ sub, oauth_type, email }) =>
          (sub === filter.sub && oauth_type === filter.oauth_type) ||
          email === filter.email,
      ) ?? null
    );
  },
};
