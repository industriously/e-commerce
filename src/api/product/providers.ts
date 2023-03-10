import { DBClientToken } from '@INFRA/DB';
import { IProductRepository, IProductUsecase } from '@INTERFACE/product';
import { ModuleMetadata, Provider } from '@nestjs/common';
import {
  FindManyProductCommandHandler,
  ProductUsecaseFactory,
} from './application';
import { ProductRepositoryFactory } from './infrastructure';
import { ProductRepositoryToken, ProductUsecaseToken } from './_constants_';

const ProductRepository: Provider<IProductRepository> = {
  inject: [DBClientToken],
  useFactory: ProductRepositoryFactory,
  provide: ProductRepositoryToken,
};

const ProductUsecase: Provider<IProductUsecase> = {
  inject: [ProductRepositoryToken],
  useFactory: ProductUsecaseFactory,
  provide: ProductUsecaseToken,
};

export const providers: ModuleMetadata['providers'] = [
  FindManyProductCommandHandler,
  ProductRepository,
  ProductUsecase,
];
