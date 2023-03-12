import { TokenService } from '@INTERFACE/token';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenServiceFactory } from './application/token.service';
import { TokenServiceToken } from './constants';

const TokenService: Provider<TokenService> = {
  provide: TokenServiceToken,
  inject: [JwtService, ConfigService],
  useFactory: TokenServiceFactory,
};

export const providers: Provider[] = [TokenService];
