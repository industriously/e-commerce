import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { OrdersController } from './presentation';
import { providers } from './providers';

@Module({
  imports: [TokenModule],
  providers,
  controllers: [OrdersController],
})
export class OrderModule {}
