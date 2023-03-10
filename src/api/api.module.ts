import { Module } from '@nestjs/common';
import { ProductModule } from '@PRODUCT/product.module';
import { UserModule } from '@USER/user.module';
import { OrderModule } from '@ORDER/order.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule],
})
export class ApiModule {}
