import { IConnection } from '@nestia/fetcher';
import { Test } from '@nestjs/testing';
import { FilterModule } from '@INFRA/filter/filter.module';
import { ConfigModule } from '@INFRA/config/config.module';
import { INestApplication } from '@nestjs/common';
import { UserRepositoryToken } from '@USER/_constants_';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AopModule } from '@toss/nestjs-aop';
import { ProductRepository, UserRepository } from './mock/repository';
import { config, jwtService } from './mock/provider';
import { TestUsers } from '@USER/__tests__/users';
import { TestUser } from '@USER/__tests__/user';
import { TestAuth } from '@USER/__tests__/auth';
import { UserModule } from '@USER/user.module';
import { ProductModule } from '@PRODUCT/product.module';
import { ProductRepositoryToken } from '@PRODUCT/_constants_';
import { TestProduct } from '@PRODUCT/__tests__';

describe('API Test', () => {
  const connection = {
    host: `http://localhost:${config.get<string>('PORT')}`,
  } satisfies IConnection;

  let app: INestApplication | null = null;

  beforeAll(async () => {
    const TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        FilterModule,
        AopModule,
        UserModule,
        ProductModule,
      ],
    })
      .overrideProvider(ProductRepositoryToken)
      .useValue(ProductRepository)
      .overrideProvider(UserRepositoryToken)
      .useValue(UserRepository)
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .overrideProvider(ConfigService)
      .useValue(config)
      .compile();

    app = TestingModule.createNestApplication();

    await app.init();
    await app.listen(config.get<string>('PORT'));
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('AuthUsecase', () => {
    describe('sign_in.google.signInGoogle', TestAuth.test_sign_in_google);
    describe(
      'token.refresh.refreshToken - get access_token by refresh_token',
      TestAuth.test_refresh(connection),
    );
  });

  describe('UserUsecase', () => {
    describe(
      "users.getPublicProfile - get activate user's public profile by user_id",
      TestUsers.test_get_public_profile(connection),
    );

    describe(
      "user.getProfile - get user's detail profile by access_token",
      TestUser.test_get_profile(connection),
    );

    describe(
      'user.updateProfile - update user profile by access_token',
      TestUser.test_update_profile(connection),
    );

    describe(
      'user.inActivate - remove user by access_token',
      TestUser.test_user_inactivate(connection),
    );
  });

  describe('ProductUsecase', () => {
    describe(
      'products.find - get product detail info by product_id',
      TestProduct.test_find(connection),
    );

    describe(
      'products.findMany - get product general info list',
      TestProduct.test_find_many(connection),
    );
  });
});
