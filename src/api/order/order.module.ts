import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenModule } from '../token/token.module';
import { OrdersController } from './presentation';
import { providers } from './providers';

@Module({
  imports: [CqrsModule, TokenModule],
  providers,
  controllers: [OrdersController],
})
export class OrderModule {}
