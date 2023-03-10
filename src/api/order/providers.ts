import { DBClientToken } from '@INFRA/DB';
import { IOrderRepository, IOrderUsecase } from '@INTERFACE/order';
import { Provider } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TokenServiceToken } from '../token/constants';
import { OrderUsecaseFactory } from './application';
import { OrderRepositoryFactory } from './infrastructure';
import { OrderRepositoryToken, OrderUsecaseToken } from './_constants_';

const OrderUsecase: Provider<IOrderUsecase> = {
  provide: OrderUsecaseToken,
  inject: [CommandBus, OrderRepositoryToken, TokenServiceToken],
  useFactory: OrderUsecaseFactory,
};

const OrderRepository: Provider<IOrderRepository> = {
  provide: OrderRepositoryToken,
  inject: [DBClientToken],
  useFactory: OrderRepositoryFactory,
};

export const providers: Provider[] = [OrderRepository, OrderUsecase];
