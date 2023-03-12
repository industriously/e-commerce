import { UserSchema } from './user.schema.interface';

export namespace AuthUsecase {
  export interface SignInBody {
    readonly code: string;
  }

  export interface SignInResponse {
    readonly access_token: string;
    readonly refresh_token: string;
    readonly id_token: string;
  }

  export interface RefreshResponse {
    readonly access_token: string;
  }
}

export interface AuthUsecase {
  readonly signIn: (
    profile: UserSchema.OauthProfile,
  ) => Promise<AuthUsecase.SignInResponse>;
  readonly refresh: (token: string) => Promise<AuthUsecase.RefreshResponse>;
}
