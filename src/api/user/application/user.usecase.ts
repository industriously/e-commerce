import { UserMapper } from '@USER/domain';
import { ProviderBuilder, pipeAsync, Nullish } from '@UTIL';
import { TokenService, TokenSchema } from '@INTERFACE/token';
import { UserRepository, UserUsecase } from '@INTERFACE/user';
import { HttpExceptionFactory } from '@COMMON/exception';
import { pipe } from 'rxjs';

export const UserUsecaseFactory = (
  repository: UserRepository,
  tokenService: TokenService,
): UserUsecase => {
  const get_id_from_token = () =>
    [
      tokenService.getAccessTokenPayload,
      ({ id }: TokenSchema.AccessTokenPayload) => id,
    ] as const;
  return ProviderBuilder<UserUsecase>({
    getPublic(id) {
      return pipeAsync(
        repository.findOne(),

        Nullish.throwIf(HttpExceptionFactory('NotFound')),

        UserMapper.toPublic,
      )(id);
    },

    getDetail(token) {
      return pipeAsync(
        ...get_id_from_token(),

        repository.findOne(),

        Nullish.throwIf(HttpExceptionFactory('NotFound')),

        UserMapper.toDetail,
      )(token);
    },

    update(token, data) {
      return pipe(
        ...get_id_from_token(),

        repository.update(data),
      )(token);
    },
    remove(token) {
      return pipe(
        ...get_id_from_token(),

        repository.remove,
      )(token);
    },
  }).build();
};
