import { AuthUsecase, UserSchema } from '@INTERFACE/user';
import typia from 'typia';

export namespace signIn {
  export const test_success =
    (usecase: AuthUsecase) => async (profile: UserSchema.OauthProfile) => {
      const received = await usecase.signIn(profile);

      typia.assertEquals(received);
    };
}
