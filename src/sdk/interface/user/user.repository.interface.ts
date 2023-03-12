import { IRepository } from '@INTERFACE/common';
import { UserSchema } from './user.schema.interface';

export namespace UserRepository {
  export type CreateData = Pick<
    UserSchema.Aggregate,
    'sub' | 'oauth_type' | 'email' | 'username'
  >;
  export type UpdatableData = Pick<
    UserSchema.Aggregate,
    'address' | 'email' | 'is_deleted' | 'phone' | 'username'
  >;

  export type UpdateData = Partial<Omit<UpdatableData, 'is_deleted'>>;

  export type FindOneByOauthFilter = Pick<
    UserSchema.Aggregate,
    'sub' | 'oauth_type' | 'email'
  >;
}

export interface UserRepository
  extends IRepository<UserSchema.Aggregate, string> {
  readonly findOneByOauth: (
    filter: UserRepository.FindOneByOauthFilter,
  ) => Promise<UserSchema.Aggregate | null>;

  readonly create: (
    data: UserRepository.CreateData,
  ) => Promise<UserSchema.Aggregate>;

  readonly update: (
    data: UserRepository.UpdateData,
  ) => (id: string) => Promise<void>;
}
