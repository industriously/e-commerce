import { TransactionMarker } from '@COMMON/decorator/lazy';
import { HttpExceptionFactory } from '@COMMON/exception';
import { TokenService } from '@INTERFACE/token';
import { AuthUsecase, UserRepository } from '@INTERFACE/user';
import { UserBusiness } from '@USER/domain';
import { Nullish, pipeAsync, ProviderBuilder } from '@UTIL';

export const AuthUsecaseFactory = (
  repository: UserRepository,
  tokenService: TokenService,
): AuthUsecase => {
  return ProviderBuilder<AuthUsecase>({
    signIn(profile) {
      return pipeAsync(
        repository.findOneByOauth,

        (agg) =>
          Nullish.is(agg)
            ? repository.create(profile)
            : UserBusiness.isInActive(agg)
            ? repository.save(UserBusiness.activate(agg))
            : agg,

        (agg): AuthUsecase.SignInResponse => ({
          access_token: tokenService.getAccessToken(agg),
          refresh_token: tokenService.getRefreshToken(agg),
          id_token: tokenService.getIdToken(agg),
        }),
      )(profile);
    },

    refresh(token) {
      return pipeAsync(
        tokenService.getRefreshTokenPayload,

        ({ id }) => id,

        repository.findOne(),

        Nullish.throwIf(HttpExceptionFactory('NotFound')),

        (agg): AuthUsecase.RefreshResponse => ({
          access_token: tokenService.getAccessToken(agg),
        }),
      )(token);
    },
  })
    .mark('signIn', TransactionMarker())
    .build();
};
