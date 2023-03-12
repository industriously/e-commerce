import { DBClientToken } from '@INFRA/DB';
import { ProductRepository, ProductUsecase } from '@INTERFACE/product';
import { Provider } from '@nestjs/common';
import {
  FindManyProductCommandHandler,
  ProductUsecaseFactory,
} from './application';
import { ProductRepositoryFactory } from './infrastructure';
import { ProductRepositoryToken, ProductUsecaseToken } from './_constants_';

const ProductRepository: Provider<ProductRepository> = {
  inject: [DBClientToken],
  useFactory: ProductRepositoryFactory,
  provide: ProductRepositoryToken,
};

const ProductUsecase: Provider<ProductUsecase> = {
  inject: [ProductRepositoryToken],
  useFactory: ProductUsecaseFactory,
  provide: ProductUsecaseToken,
};

export const providers: Provider[] = [
  FindManyProductCommandHandler,
  ProductRepository,
  ProductUsecase,
];
