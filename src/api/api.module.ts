import { Module } from '@nestjs/common';
import { ProductModule } from '@PRODUCT/product.module';
import { UserModule } from '@USER/user.module';
import { OrderModule } from 'src/api/orders/order.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule],
})
export class ApiModule {}
