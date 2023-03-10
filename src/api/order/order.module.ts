import { Module } from '@nestjs/common';
import { ProductModule } from '@PRODUCT/product.module';
import { TokenModule } from '../token/token.module';
import { OrdersController } from './presentation';
import { providers } from './providers';

@Module({
  imports: [TokenModule, ProductModule],
  providers,
  controllers: [OrdersController],
})
export class OrderModule {}
