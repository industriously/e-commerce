import { UserSchema } from './user.schema.interface';

export namespace UserUsecase {
  export interface UpdateData
    extends Partial<
      Pick<UserSchema.Aggregate, 'username' | 'address' | 'phone'>
    > {}
}

export interface UserUsecase {
  readonly getPublic: (
    id: UserSchema.Aggregate['id'],
  ) => Promise<UserSchema.Public>;

  readonly getDetail: (token: string) => Promise<UserSchema.Detail>;

  readonly update: (
    token: string,
    data: UserUsecase.UpdateData,
  ) => Promise<void>;

  readonly remove: (token: string) => Promise<void>;
}
