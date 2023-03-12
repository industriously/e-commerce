import { DBClientToken } from '@INFRA/DB';
import { AuthUsecase, UserRepository, UserUsecase } from '@INTERFACE/user';
import { Provider } from '@nestjs/common';
import { TokenServiceToken } from '../token/constants';
import { AuthUsecaseFactory, UserUsecaseFactory } from './application';
import { UserRepositoryFactory } from './infrastructure/user.repository';
import {
  GithubStrategy,
  GithubStrategyToken,
  GoogleStrategy,
  GoogleStrategyToken,
} from './_auth_';
import {
  AuthUsecaseToken,
  UserRepositoryToken,
  UserUsecaseToken,
} from './_constants_';

const GoogleStrategyProvider: Provider<GoogleStrategy> = {
  useClass: GoogleStrategy,
  provide: GoogleStrategyToken,
};
const GithubStrategyProvider: Provider<GithubStrategy> = {
  useClass: GithubStrategy,
  provide: GithubStrategyToken,
};
const UserRepository: Provider<UserRepository> = {
  inject: [DBClientToken],
  useFactory: UserRepositoryFactory,
  provide: UserRepositoryToken,
};
const UserUsecase: Provider<UserUsecase> = {
  inject: [UserRepositoryToken, TokenServiceToken],
  useFactory: UserUsecaseFactory,
  provide: UserUsecaseToken,
};
const AuthUsecase: Provider<AuthUsecase> = {
  inject: [UserRepositoryToken, TokenServiceToken],
  useFactory: AuthUsecaseFactory,
  provide: AuthUsecaseToken,
};

export const providers: Provider[] = [
  GoogleStrategyProvider,
  GithubStrategyProvider,
  UserRepository,
  UserUsecase,
  AuthUsecase,
];
