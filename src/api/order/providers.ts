import { DBClientToken } from '@INFRA/DB';
import { IOrderRepository, IOrderUsecase } from '@INTERFACE/order';
import { Provider } from '@nestjs/common';
import { ProductRepositoryToken } from '@PRODUCT/_constants_';
import { TokenServiceToken } from '../token/constants';
import { OrderUsecaseFactory } from './application';
import { OrderRepositoryFactory } from './infrastructure';
import { OrderRepositoryToken, OrderUsecaseToken } from './_constants_';

const OrderUsecase: Provider<IOrderUsecase> = {
  provide: OrderUsecaseToken,
  inject: [TokenServiceToken, OrderRepositoryToken, ProductRepositoryToken],
  useFactory: OrderUsecaseFactory,
};

const OrderRepository: Provider<IOrderRepository> = {
  provide: OrderRepositoryToken,
  inject: [DBClientToken],
  useFactory: OrderRepositoryFactory,
};

export const providers: Provider[] = [OrderRepository, OrderUsecase];
